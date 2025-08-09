const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');
module.exports = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return res.status(400).send('Webhook secret not configured');
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.log('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  console.log('Received Stripe event:', event.type);
  res.json({ received: true });
};
