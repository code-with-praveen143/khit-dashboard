const express = require('express');

const {
    createTenant,
    getTenants,
    updateTenant,
    deleteTenant,
} = require('../controllers/tenantController');

const authMiddleware = require('../middleware/authMiddleware');
const ensureRole = require('../middleware/roleMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tenants
 *   description: APIs for managing tenants
 */

/**
 * @swagger
 * /api/tenants:
 *   post:
 *     summary: Create a new tenant
 *     tags: [Tenants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "College ABC"
 *               email:
 *                 type: string
 *                 example: "admin@collegeabc.com"
 *               subdomain:
 *                 type: string
 *                 example: "collegeabc"
 *     responses:
 *       201:
 *         description: Tenant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tenant created successfully"
 *                 tenant:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64fe832b2fce456123ab456c"
 *                     name:
 *                       type: string
 *                       example: "College ABC"
 *                     email:
 *                       type: string
 *                       example: "admin@collegeabc.com"
 *                     subdomain:
 *                       type: string
 *                       example: "collegeabc"
 *                     databaseUri:
 *                       type: string
 *                       example: "mongodb://localhost:27017/collegeabc"
 *       400:
 *         description: Tenant with subdomain already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/tenants:
 *   get:
 *     summary: Get all tenants
 *     tags: [Tenants]
 *     responses:
 *       200:
 *         description: List of all tenants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "64fe832b2fce456123ab456c"
 *                   name:
 *                     type: string
 *                     example: "College ABC"
 *                   email:
 *                     type: string
 *                     example: "admin@collegeabc.com"
 *                   subdomain:
 *                     type: string
 *                     example: "collegeabc"
 *                   databaseUri:
 *                     type: string
 *                     example: "mongodb://localhost:27017/collegeabc"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/tenants/{id}:
 *   get:
 *     summary: Get details of a specific tenant
 *     tags: [Tenants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The tenant ID
 *     responses:
 *       200:
 *         description: Tenant details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "64fe832b2fce456123ab456c"
 *                 name:
 *                   type: string
 *                   example: "College ABC"
 *                 email:
 *                   type: string
 *                   example: "admin@collegeabc.com"
 *                 subdomain:
 *                   type: string
 *                   example: "collegeabc"
 *                 databaseUri:
 *                   type: string
 *                   example: "mongodb://localhost:27017/collegeabc"
 *       404:
 *         description: Tenant not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/tenants/{id}:
 *   put:
 *     summary: Update tenant details
 *     tags: [Tenants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The tenant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated College Name"
 *               email:
 *                 type: string
 *                 example: "updated@collegeabc.com"
 *               subdomain:
 *                 type: string
 *                 example: "updatedcollegeabc"
 *     responses:
 *       200:
 *         description: Tenant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tenant updated successfully"
 *                 tenant:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64fe832b2fce456123ab456c"
 *                     name:
 *                       type: string
 *                       example: "Updated College Name"
 *                     email:
 *                       type: string
 *                       example: "updated@collegeabc.com"
 *                     subdomain:
 *                       type: string
 *                       example: "updatedcollegeabc"
 *       404:
 *         description: Tenant not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/tenants/{id}:
 *   delete:
 *     summary: Delete a tenant
 *     tags: [Tenants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The tenant ID
 *     responses:
 *       200:
 *         description: Tenant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tenant deleted successfully"
 *       404:
 *         description: Tenant not found
 *       500:
 *         description: Internal server error
 */

// Apply middleware for authentication and role authorization
//router.use(authMiddleware);
//router.use(ensureRole('super-admin'));

// Tenant routes
router.post('/', createTenant); // Create a new tenant
router.get('/', getTenants); // Get all tenants
router.put('/:id', updateTenant); // Update tenant details
router.delete('/:id', deleteTenant); // Delete a tenant

module.exports = router;
