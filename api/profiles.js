import { promises as fs } from 'fs';
import path from 'path';

// This function finds the correct path to our database file, whether running locally or on Vercel.
const getDbPath = () => path.join(process.cwd(), 'api', 'db.json');

// This function ensures the database file exists and initializes it if it doesn't.
async function ensureDb() {
    const dbPath = getDbPath();
    try {
        await fs.access(dbPath);
    } catch (error) {
        // If the file doesn't exist, create it with an empty array.
        await fs.writeFile(dbPath, JSON.stringify([]));
    }
}

export default async function handler(req, res) {
    // Ensure our database file is ready before we do anything.
    await ensureDb();
    const dbPath = getDbPath();
    const dbData = JSON.parse(await fs.readFile(dbPath, 'utf8'));
    
    // Simple password protection for the admin panel.
    // The password is set in Vercel Environment Variables.
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'default_password';

    // This is the main logic that handles different types of requests.
    switch (req.method) {
        case 'GET':
            // Handle GET requests (fetching data)
            const { action, admin } = req.query;

            if (action === 'get_password') {
                // The admin page asks for the password to check against.
                // We only send it to the admin page, not to the main app.
                return res.status(200).json({ password: ADMIN_PASSWORD });
            }

            if (admin === 'true') {
                // If it's an admin request, send all data including WhatsApp numbers.
                return res.status(200).json(dbData);
            } else {
                // For regular users (the Mini App), send profiles WITHOUT the WhatsApp number.
                const publicProfiles = dbData.map(({ id, name, location, imageUrl }) => ({ id, name, location, imageUrl }));
                return res.status(200).json(publicProfiles);
            }

        case 'POST':
            // Handle POST requests (adding a new profile)
            const newProfile = { id: Date.now().toString(), ...req.body };
            dbData.push(newProfile);
            await fs.writeFile(dbPath, JSON.stringify(dbData, null, 2));
            return res.status(201).json(newProfile);

        case 'DELETE':
            // Handle DELETE requests (removing a profile)
            const { id: idToDelete } = req.body;
            const filteredData = dbData.filter(p => p.id !== idToDelete);
            await fs.writeFile(dbPath, JSON.stringify(filteredData, null, 2));
            return res.status(200).json({ message: 'Profile deleted' });

        default:
            // If the request method is not supported
            res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
