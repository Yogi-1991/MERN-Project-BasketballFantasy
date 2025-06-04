import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "../config/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddWalletAmount() {
  const [amount, setAmount] = useState(100);
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        "/createPaymentIntent",
        { amount },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        // Confirm wallet credit
        await axios.post(
          "/confirmPayment'",
          { amount },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        toast.success("Wallet updated!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md border border-orange-400">
      <h2 className="text-xl font-bold text-center text-orange-600 mb-4">Add Money to Wallet</h2>
      <form onSubmit={handlePayment}>
        <label className="block text-gray-700 mb-2">Amount (in ₹)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          className="w-full border p-2 rounded mb-4"
          min={1}
          required
        />

        <CardElement className="p-4 border rounded mb-4" />

        <button
          type="submit"
          disabled={!stripe || loading}
          className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 w-full"
        >
          {loading ? "Processing..." : "Add Funds"}
        </button>
      </form>
    </div>
  );
}
