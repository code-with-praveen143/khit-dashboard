const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  performedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to the User who performed the action
  action: { 
    type: String, 
    required: true 
  }, // Description of the action
  targetModel: { 
    type: String, 
    required: true 
  }, // The affected model, e.g., "StudentFee"
  targetId: { 
    type: mongoose.Schema.Types.ObjectId 
  }, // ID of the affected document
  changes: { 
    type: Object 
  }, // Details of the changes made
  timestamp: { 
    type: Date, 
    default: Date.now 
  }, // Time of the action
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
