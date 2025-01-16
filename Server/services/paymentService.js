// services/paymentService.js
const crypto = require('crypto');
const Payment = require('../models/Payment');

const initiatePayment = async (orderId, amount) => {
  // Mock request to ICICI Eazypay API
  const paymentRequest = {
    merchantId: process.env.ICICI_MERCHANT_ID,
    orderId,
    amount,
    redirectUrl: 'https://khit.campusify.io/dashboard/return-url',
  };

  // Generate checksum/hash if required
  const hash = crypto.createHash('sha256').update(`${orderId}|${amount}`).digest('hex');
  paymentRequest.hash = hash;

  // Save pending payment in DB
  const payment = new Payment({ orderId, amount });
  await payment.save();

  // Return mock payment URL (replace with actual API call)
  return {
    paymentUrl: `https://eazypay.icicibank.com/payment/${hash}`,
    paymentRequest,
  };
};

const verifyPayment = async (paymentData) => {
  const { orderId, status, transactionId, amount, message } = paymentData;

  // Find the payment in the database
  const payment = await Payment.findOne({ orderId });
  if (!payment) throw new Error('Payment not found');

  // Update payment status based on the transaction response
  payment.status = status === 'SUCCESS' ? 'success' : 'failure';
  payment.transactionId = transactionId || null;
  payment.amount = amount || payment.amount; // Update amount if available
  payment.responseMessage = message || 'No message provided'; // Add any message
  payment.updatedAt = new Date();

  await payment.save();

  return payment;
};



module.exports = { initiatePayment, verifyPayment };
