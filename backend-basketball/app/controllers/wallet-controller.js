
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const walletControl = {};

// walletControl.createPaymentIntent = async (req, res) => {
//   try {
//     const { amount } = req.body; // e.g., 100 INR = 10000 paise

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount * 100, // Stripe expects amount in paise
//       currency: 'inr',
//       payment_method_types: ['card'],
//     });

//     res.status(200).json({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error('Stripe error:', error);
//     res.status(500).json({ message: 'Stripe payment creation failed' });
//   }
// };


//   export default walletControl;