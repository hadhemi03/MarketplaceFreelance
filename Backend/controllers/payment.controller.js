import Stripe from 'stripe';
import Payment from '../models/Payment.model.js';
import Project from '../models/Project.model.js';
import User from "../models/User.model.js";

const stripe = new Stripe('sk_test_51RI4TuPO6U60hsxDyeKs9i9Gp9rpS4ypu96svOK7Se3brTPhmdqZSBr9JTMEbMj48S6FkV7r7UDkS1F8g4RxPikA00a16UzTwT');

export const createPaymentIntent = async (req, res) => {
    try {
        console.log("Request Data:", req.body); // Log incoming data

        const { price, freelancerId, projectId, clientId } = req.body;

        // Check if all required parameters are provided
        if (!freelancerId || !projectId || !price || !clientId) {
            return res.status(400).send({ error: "Missing required parameters" });
        }

        // Create a payment intent with the amount and currency (example using Stripe)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: price, // price in cents
            currency: 'usd',
            metadata: {
              clientId,
              freelancerId,
              projectId,
            },
          });
      
          // Save the payment details to the database
          const newPayment = new Payment({
            clientId,
            freelancerId,
            projectId,
            paymentIntentId: paymentIntent.id,
            amount: price,
            status: paymentIntent.status, // Set status initially
          });
          await newPayment.save();
      
          res.status(200).json({ clientSecret: paymentIntent.client_secret });
        } catch (err) {
          console.error('Error creating payment intent:', err);
          res.status(500).json({ error: 'Error creating payment intent' });
        }
};

// Update Payment status (after success)
export const updatePaymentStatus = async (req, res) => {
    console.log("Received request to update payment status", req.body);

    try {
        const { paymentIntentId, status } = req.body;
        
        if (!paymentIntentId || !status) {
          return res.status(400).json({ error: 'Payment Intent ID and status are required' });
        }
    
        // Update the payment status in your database here
        const payment  = await Payment.findOneAndUpdate(
          { paymentIntentId },
          { status },
          { new: true }
        );
    
        if (!payment) {
          return res.status(404).json({ error: 'Payment not found' });
        }
    
        res.status(200).json({ message: 'Payment status updated successfully', payment });
      } catch (err) {
        console.error('Error updating payment status:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
};

export const savePayment = async (req, res) => {
    const { sessionId } = req.body;  // Extract session_id from the frontend request
  
    try {
      // Step 1: Retrieve the session from Stripe using session_id
      const session = await stripe.checkout.sessions.retrieve(sessionId);
  
      // Step 2: Check if the payment was successful
      if (session.payment_status === 'paid') {
        // Step 3: Extract details from the session (client, freelancer, amount, etc.)
        const { clientId, freelancerId, amount, projectId } = session.metadata; // Assuming you stored these in metadata
  
        // Step 4: Save payment to the database
        const newPayment = new Payment({
          clientId,
          freelancerId,
          amount,
          projectId,
          status: 'completed', // Payment completed, you can set this dynamically
          createdAt: new Date(),
        });
  
        await newPayment.save(); // Save the payment in the database
  
        return res.status(201).json({ message: 'Payment saved successfully', payment: newPayment });
      } else {
        return res.status(400).json({ message: 'Payment not completed' });
      }
    } catch (error) {
      console.error('Error saving payment:', error);
      return res.status(500).json({ message: 'Failed to save payment' });
    }
  };




// Get all payments (for admin)
export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('clientId freelancerId projectId');
        res.status(200).json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch payments' });
    }
};

// Get all payments for a client
export const getClientPayments = async (req, res) => {
    try {
        const { clientId } = req.params;
        const payments = await Payment.find({ clientId })
            .populate('freelancerId', 'username')  // Make sure you have 'username' not 'name'
            .populate('projectId', 'projectName')  // Make sure you use 'projectName' not 'title'
            .select('amount freelancerId projectId createdAt status');

        if (!payments.length) {
            return res.status(404).json({ message: 'No payments found' });
        }

        res.status(200).json({ payments }); // returns { payments: [...] }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch client payments' });
    }
};





// Get all payments for a freelancer
export const getFreelancerPayments = async (req, res) => {
    try {
        const freelancerId = req.params.freelancerId;
        const payments = await Payment.find({ freelancerId }).populate('clientId projectId');
        res.status(200).json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch freelancer payments' });
    }
};