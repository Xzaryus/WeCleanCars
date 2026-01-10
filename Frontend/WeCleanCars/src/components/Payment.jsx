import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
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
                card: elements.getElement(CardNumberElement),
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
        <form id="paymentForm" onSubmit={handlePayment}>
            <h3>Payment Details</h3>
            <div className="formRow">
            <label htmlFor="cardNumber">Card Number</label>
            <CardNumberElement className="stripeInput" />
            </div>
            <div className="formRow">
            <label htmlFor="expiryDate">Expiry Date</label>
            <CardExpiryElement className="stripeInput" />
            </div>
            <div className="formRow">
            <label htmlFor="cvc">CVC</label>
            <CardCvcElement className="stripeInput" />
            </div>
            <button
                type="submit"
                disabled={!stripe || loading}
            >
                {loading ? "Processing..." : `Pay £${amount}`}
            </button>
            {message && <p>{message}</p>}
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
