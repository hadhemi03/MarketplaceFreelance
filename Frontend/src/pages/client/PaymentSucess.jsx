import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id'); // Extract session_id from URL

  useEffect(() => {
    if (sessionId) {
      const token = localStorage.getItem('authToken'); // Assuming you store the token in localStorage

      // Send the session_id to the backend to save the payment
      axios
        .post('http://localhost:5000/api/payments/save', 
          { sessionId },
          {
            headers: {
              Authorization: `Bearer ${token}`,  // Attach the token if needed
            },
            withCredentials: true,  // Ensure cookies are sent with the request
          }
        )
        .then(response => {
          console.log('Payment saved successfully:', response.data);
        })
        .catch(error => {
          console.error('Error saving payment:', error);
        });
    }
  }, [sessionId]);

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase. Your payment was successful.</p>
    </div>
  );
};

export default PaymentSuccess;
