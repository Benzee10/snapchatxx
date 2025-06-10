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

  // Step 1: Reconstruct the signature to verify authenticity
  const crypto = await import('crypto');
  const hash = crypto.createHash('md5');
  const controlString = `${MERCHANT_ID}:${AMOUNT}:${SECRET_WORD_2}:${MERCHANT_ORDER_ID}`;
  hash.update(controlString);
  const expectedSign = hash.digest('hex');

  if (SIGN !== expectedSign) {
    return res.status(403).send("Invalid signature");
  }

  // Step 2: Log or process payment
  // You can link the MERCHANT_ORDER_ID with a user ID or Telegram user
  console.log(`✅ Payment received for order ${MERCHANT_ORDER_ID}. Amount: $${AMOUNT}`);

  // Optional: Update your subscription database here (like Firebase)

  return res.status(200).send("OK");
}
