import User from '../modules/user-schema-module.js';
import Stripe from 'stripe';
const walletControl = {};

walletControl.createPaymentIntent = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { amount } = req.body; // Amount in rupees (e.g., 100 for ₹100)
    const userId = req.userId;
  
    if (!amount || amount < 1) {
      return res.status(400).json({ error: "Invalid amount" });
    }
  
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe accepts in paise
        currency: "inr",
        metadata: { userId },
      });
  
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (err) {
      console.error("Stripe error:", err);
      res.status(500).json({ error: "Stripe error" });
    }
};


    walletControl.confirmPayment = async (req, res) => {
    const { amount } = req.body;
    const userId = req.userId;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });
  
      user.wallet.balance += amount;
      user.wallet.history.push({
        amount,
        type: "credit",
        description: `Wallet top-up via Stripe`,
      });
  
      await user.save();
      res.status(200).json({ message: "Wallet updated successfully" });
    } catch (err) {
      console.error("Error confirming payment:", err);
      res.status(500).json({ error: "Could not update wallet" });
    }
  };

  export default walletControl;