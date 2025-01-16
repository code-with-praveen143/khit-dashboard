// routes/encryptionRoutes.js
const express = require('express');
const router = express.Router();
const encryptionController = require('../controllers/encryptionController');

/**
 * @swagger
 * tags:
 *   name: Encryption
 *   description: APIs to manage Encryption
 */

/**
 * @swagger
 * /api/encryption/generate:
 *   post:
 *     summary: Generate Encrypted ICICI Payment URL
 *     tags: [Encryption]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               merchantID:
 *                 type: string
 *               mandatoryFields:
 *                 type: string
 *               optionalFields:
 *                 type: string
 *               returnURL:
 *                 type: string
 *               referenceNo:
 *                 type: string
 *               subMerchantID:
 *                 type: string
 *               transactionAmount:
 *                 type: string
 *               payMode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Encrypted URL generated successfully
 */
router.post('/generate', encryptionController.createEncryptedURL);

/**
 * @swagger
 * /api/encryption/decrypt:
 *   post:
 *     summary: Decrypt an encrypted ICICI payment URL
 *     tags: [Decryption]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               encryptedURL:
 *                 type: string
 *                 description: The encrypted URL to be decrypted.
 *                 example: "https://eazypay.icicibank.com/EazyPG?merchantid=386949&mandatory fields=aJIJpeX/YCya2yIA5k63tQ=="
 *     responses:
 *       200:
 *         description: Successfully decrypted the URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 decryptedParams:
 *                   type: object
 *                   description: The decrypted parameters.
 *       400:
 *         description: Missing encrypted URL in the request body.
 *       500:
 *         description: Internal server error.
 */
router.post("/decrypt", encryptionController.decryptEncryptedURL);

module.exports = router;
