import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
  readFileSync('./firebase-service-account.json', 'utf-8') // Replace path as needed
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  const {
    AMOUNT,
    MERCHANT_ORDER_ID,
    intid,
    P_EMAIL,
    P_PHONE,
    SIGN
  } = req.query;

  const SECRET_WORD_2 = "kdc54qa{Nen5eb]";
  const MERCHANT_ID = "62869";

  const crypto = await import('crypto');
  const hash = crypto.createHash('md5');
  const controlString = `${MERCHANT_ID}:${AMOUNT}:${SECRET_WORD_2}:${MERCHANT_ORDER_ID}`;
  hash.update(controlString);
  const expectedSign = hash.digest('hex');

  if (SIGN !== expectedSign) {
    return res.status(403).send("Invalid signature");
  }

  // Save paid user
  await db.collection('paid_users').doc(MERCHANT_ORDER_ID).set({
    user_id: MERCHANT_ORDER_ID,
    amount: AMOUNT,
    email: P_EMAIL,
    phone: P_PHONE,
    paid_at: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log(`✅ Stored payment for Telegram User ID: ${MERCHANT_ORDER_ID}`);
  return res.status(200).send("OK");
}
