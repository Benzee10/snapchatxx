import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, credential } from 'firebase-admin/app';

if (!admin.apps.length) {
  initializeApp({
    credential: credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  });
}

export default async function handler(req, res) {
  const {
    AMOUNT,
    MERCHANT_ORDER_ID,
    P_EMAIL,
    P_PHONE,
    SIGN
  } = req.query;

  const db = getFirestore();
  const SECRET = "kdc54qa{Nen5eb]";
  const MID = "62869";
  const expectedSign = require('crypto')
    .createHash('md5')
    .update(`${MID}:${AMOUNT}:${SECRET}:${MERCHANT_ORDER_ID}`)
    .digest('hex');

  if (SIGN !== expectedSign) {
    return res.status(403).send("Invalid signature");
  }

  await db.collection('paid_users').doc(MERCHANT_ORDER_ID).set({
    amount: AMOUNT,
    email: P_EMAIL,
    phone: P_PHONE,
    paid_at: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log(`✅ Payment saved: ${MERCHANT_ORDER_ID}`);
  res.status(200).send("OK");
}
