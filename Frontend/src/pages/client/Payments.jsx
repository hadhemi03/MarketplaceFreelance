import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // <-- use 'react-router-dom', not 'react-router'

// Load Stripe public key
const stripePromise = loadStripe('pk_test_51RI4TuPO6U60hsxDgQTGOVkMrnS0XTHIw9QFCgxQwHV8s1zUUD53no2eGR8fAj32cUxQbonfthCkWRDBU70s1MCs00iiKvD2oP');

const PaymentPage = () => {
  const { freelancerId, projectId, price } = useParams();
  const parsedPrice = parseFloat(price);

  const userString = localStorage.getItem('currentUser');
  const token = localStorage.getItem('token');

  if (!userString || !token) {
    console.error('User or token missing, redirecting to login...');
    return <div>Please log in to proceed with payment.</div>;
  }

  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    console.error('Invalid payment price:', price);
    return <div>Invalid payment price</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm freelancerId={freelancerId} projectId={projectId} price={parsedPrice} />
    </Elements>
  );
};


const CheckoutForm = ({ freelancerId, projectId, price }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const createPaymentIntent = async () => {
      const userString = localStorage.getItem('currentUser');
      const token = localStorage.getItem('token');

      if (!userString || !token) {
        console.error('User info or token not found in localStorage.');
        return;
      }

      const user = JSON.parse(userString);
      const clientId = user?.userId;

      ;

      if (!clientId) {
        console.error('Client ID not found in user object!');
        return;
      }

      try {
        setLoading(true);

        console.log({
          price: Math.round(price * 100),
          clientId,
          freelancerId,
          projectId,
        });


        const response = await axios.post(
          'http://localhost:5000/api/payments/create-payment-intent',
          {
            price: Math.round(price * 100), // price in cents
            clientId,
            freelancerId,
            projectId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        const { clientSecret } = response.data;
        if (clientSecret) {
          setClientSecret(clientSecret);
        } else {
          console.error('Server did not return a clientSecret.');
        }
      } catch (err) {
        console.error('Error creating payment intent:', err);
      } finally {
        setLoading(false);
      }
    };

    if (price > 0) {
      createPaymentIntent();
    }
  }, [freelancerId, projectId, price]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');


    if (!stripe || !elements) {
      console.error('Stripe.js has not loaded yet.');
      return;
    }

    if (!clientSecret) {
      console.error('Client Secret is missing!');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error('CardElement not found.');
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      console.error('Stripe error:', error.message);
      alert('Payment Failed: ' + error.message);
    } else if (paymentIntent.status === 'succeeded') {
      console.log('Payment succeeded!', paymentIntent);
      alert('Payment Succeeded!');

      // Update the payment status in database
      try {
        const res = await axios.post(
          'http://localhost:5000/api/payments/update-payment-status',
          {
            paymentIntentId: paymentIntent.id,
            status: paymentIntent.status,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
            
          }
        );
        alert('Payment successful!');
        navigate('/client/payments/success');
      } catch (err) {
        console.error('Error updating payment status:', err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-4">Pay {price} USD</h2>
      <CardElement />
      <button type="submit" disabled={!stripe || loading || !clientSecret} className="btn btn-primary mt-4">
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default PaymentPage;
