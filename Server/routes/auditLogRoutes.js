const express = require('express');
const { getAuditLogs } = require('../controllers/auditLogController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Audit Logs
 *   description: APIs to fetch audit logs
 */

/**
 * @swagger
 * /api/auditLogs:
 *   get:
 *     summary: Get audit logs
 *     tags: [Audit Logs]
 *     responses:
 *       200:
 *         description: Successfully fetched audit logs
 */
router.get('/', authMiddleware, getAuditLogs);

module.exports = router;
