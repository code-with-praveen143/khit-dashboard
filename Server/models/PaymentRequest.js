// models/PaymentRequest.js
const mongoose = require('mongoose');

const PaymentRequestSchema = new mongoose.Schema({
  merchantID: { type: String, required: true },
  mandatoryFields: { type: String, required: true },
  optionalFields: { type: String },
  returnURL: { type: String, required: true },
  referenceNo: { type: String, required: true },
  subMerchantID: { type: String, required: true },
  transactionAmount: { type: String, required: true },
  payMode: { type: String, required: true },
  encryptedURL: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PaymentRequest', PaymentRequestSchema);
