const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subdomain: { type: String, required: true, unique: true },
  databaseUri: { type: String, required: true },
  paymentGateways: [
    {
      gatewayName: { type: String, required: true },
      apiKey: { type: String, required: true },
      secretKey: { type: String, required: true },
      isActive: { type: Boolean, default: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Tenant', tenantSchema);
