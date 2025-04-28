import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming your clients are in the User model
    required: true,
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'usd',
  },
  status: {
    type: String,
    enum: [
      'requires_payment_method',
      'requires_confirmation',
      'requires_action',
      'processing',
      'succeeded',
      'failed',
    ], // Add all the possible status values from Stripe
    default: 'requires_payment_method', // Default status
  },
  paymentIntentId: {
    type: String, // From Stripe
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
