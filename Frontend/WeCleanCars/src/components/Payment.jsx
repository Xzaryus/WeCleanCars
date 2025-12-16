import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function PaymentForm({ bookingIds, amount }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const ids = Array.isArray(bookingIds) ? bookingIds : [bookingIds];
            console.log(ids);

            const res = await axios.post("http://localhost:3000/api/payments/create-intent", {
                bookingIds: ids
            });

            if (!res.data || !res.data.clientSecret) {
                throw new Error(res.data?.message || "Failed to create payment intent");
            }

            const clientSecret = res.data.clientSecret;

            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                card: elements.getElement(CardElement),
                },
            });

            if (error) {
                setMessage(`Payment failed: ${error.message}`);
            } else if (paymentIntent && paymentIntent.status === "succeeded") {
                setMessage("✅ Payment successful!");
            }
        } catch (err) {
        console.error(err);
        setMessage("Something went wrong.");
        } finally {
        setLoading(false);
        }
    };

    return (
        <form onSubmit={handlePayment} className="p-4 border rounded max-w-sm mx-auto space-y-4">
        <CardElement options={{ hidePostalCode: true }} />
        <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
        >
            {loading ? "Processing..." : `Pay £${amount}`}
        </button>
        {message && <p className="text-center mt-2">{message}</p>}
        </form>
    );
}

export default function PaymentPage({ bookingIds, amount }) {
    return (
        <Elements stripe={stripePromise}>
        <PaymentForm bookingIds={bookingIds} amount={amount} />
        </Elements>
    );
}
