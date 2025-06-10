import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
  readFileSync('./firebase-service-account.json', 'utf-8')
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  const { id } = req.query;

  const doc = await db.collection('paid_users').doc(id).get();
  if (doc.exists) {
    return res.status(200).json({ paid: true });
  } else {
    return res.status(200).json({ paid: false });
  }
}
