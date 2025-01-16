const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

// Fetch audit logs
const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }); // Fetch logs sorted by latest
    res.status(200).json(logs);
  } catch (error) {
    logger.error(`Error fetching audit logs: ${error.message}`);
    res.status(500).json({ message: 'Error fetching audit logs', error: error.message });
  }
};

module.exports = { getAuditLogs };
