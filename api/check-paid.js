import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, credential } from 'firebase-admin/app';

if (!admin.apps.length) {
  initializeApp({
    credential: credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  });
}

export default async function handler(req, res) {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ paid: false });

  const db = getFirestore();
  const doc = await db.collection('paid_users').doc(userId).get();
  return res.status(200).json({ paid: doc.exists });
}
