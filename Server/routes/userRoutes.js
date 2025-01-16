const express = require('express');
const { registerUser, loginUser, getUserDetails,getAllUsers,getUserById } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const resolveTenantConnection = require('../middleware/resolveTenantConnection');
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register',resolveTenantConnection, registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post('/login',resolveTenantConnection, loginUser);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get details of the currently logged-in user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully fetched user details
 */
router.get('/me', resolveTenantConnection, authMiddleware, getUserDetails);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users for the current subdomain
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully fetched all users
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
 *                     example: "John Doe"
 *                   email:
 *                     type: string
 *                     example: "johndoe@example.com"
 *                   role:
 *                     type: string
 *                     example: "user"
 */
router.get('/', resolveTenantConnection, authMiddleware, getAllUsers);


/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64fe832b2fce456123ab456c"
 *     responses:
 *       200:
 *         description: Successfully fetched user details
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
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "johndoe@example.com"
 *                 role:
 *                   type: string
 *                   example: "user"
 *       404:
 *         description: User not found
 */
router.get('/:id', resolveTenantConnection, authMiddleware, getUserById);
module.exports = router;
