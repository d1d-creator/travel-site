const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.STRIPE_SECRET_KEY) return res.status(500).json({ error: 'Stripe not configured' });
  try {
    const { line_items, success_url, cancel_url, customer_email } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url,
      cancel_url,
      customer_email
    });
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
