import { promises as fs } from 'fs';
import path from 'path';

const getDbPath = () => path.join(process.cwd(), 'api', 'db.json');

async function ensureDb() {
    const dbPath = getDbPath();
    try {
        await fs.access(dbPath);
    } catch (error) {
        await fs.writeFile(dbPath, JSON.stringify([]));
    }
}

export default async function handler(req, res) {
    await ensureDb();
    const dbPath = getDbPath();
    let dbData;
    try {
        dbData = JSON.parse(await fs.readFile(dbPath, 'utf8'));
    } catch (e) {
        dbData = [];
    }
    
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    switch (req.method) {
        case 'GET':
            // This is for the Mini App (public users)
            // It sends profiles WITHOUT the WhatsApp number.
            const publicProfiles = dbData.map(({ id, name, location, imageUrl }) => ({ id, name, location, imageUrl }));
            return res.status(200).json(publicProfiles);

        case 'POST':
            // This method is now used for ALL admin actions:
            // 1. Verifying the password and getting profiles.
            // 2. Adding a new profile.
            // 3. Deleting a profile.

            const { action, password, data } = req.body;

            // Every admin action MUST have the correct password.
            if (password !== ADMIN_PASSWORD) {
                return res.status(401).json({ message: 'Unauthorized: Incorrect Password' });
            }

            // If password is correct, proceed with the requested action.
            switch (action) {
                case 'get_profiles':
                    // Send all data including WhatsApp numbers because password was correct.
                    return res.status(200).json(dbData);
                
                case 'add_profile':
                    const newProfile = { id: Date.now().toString(), ...data };
                    dbData.push(newProfile);
                    await fs.writeFile(dbPath, JSON.stringify(dbData, null, 2));
                    return res.status(201).json(newProfile);

                case 'delete_profile':
                    const { id: idToDelete } = data;
                    const filteredData = dbData.filter(p => p.id !== idToDelete);
                    await fs.writeFile(dbPath, JSON.stringify(filteredData, null, 2));
                    return res.status(200).json({ message: 'Profile deleted' });

                default:
                    return res.status(400).json({ message: 'Invalid action' });
            }

        // We are no longer using DELETE method directly from the frontend.
        // It's handled through the POST method with an 'action'.
        // case 'DELETE': ...

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
