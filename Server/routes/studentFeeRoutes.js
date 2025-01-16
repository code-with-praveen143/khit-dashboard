const express = require('express');
const { addStudentFee, getStudentFees, updateStudentFee, getStudentFeeById } = require('../controllers/studentFeeController');
const authMiddleware = require('../middleware/authMiddleware');
const { addStudentsFromExcel,getAllStudentsWithDetails,searchStudentsWithDetails } = require('../controllers/studentFeeController');
const multer = require('multer');
const resolveTenantConnection = require('../middleware/resolveTenantConnection');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Student Fees
 *   description: APIs to manage student fees
 */

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Add a new student fee record
 *     tags: [Student Fees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *                 example: "12345"
 *               fees:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     yearSem:
 *                       type: string
 *                       example: "1-1"
 *                     tuitionFee:
 *                       type: number
 *                       example: 50000
 *     responses:
 *       201:
 *         description: Fee record added successfully
 */
router.post('/', authMiddleware, addStudentFee);



/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all student fee records
 *     tags: [Student Fees]
 *     responses:
 *       200:
 *         description: Successfully fetched fee records
 */
router.get('/', resolveTenantConnection, authMiddleware, getStudentFees);

module.exports = router;


/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update a student's fee record
 *     tags: [Student Fees]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               yearSem:
 *                 type: string
 *                 example: "2-1"
 *               remainingFee:
 *                 type: number
 *                 example: 20000
 *     responses:
 *       200:
 *         description: Fee record updated successfully
 */
router.put('/:id',resolveTenantConnection, authMiddleware, updateStudentFee);


/**
 * @swagger
 * /api/students/{studentId}:
 *   get:
 *     summary: Get fee details by student ID
 *     description: Retrieve the fee details of a specific student by their ID.
 *     tags:
 *       - Student Fees
 *     parameters:
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the student
 *     responses:
 *       200:
 *         description: Fee details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Fee record ID
 *                 studentId:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                 amount:
 *                   type: number
 *                   description: Fee amount
 *       404:
 *         description: Student fee record not found
 *       500:
 *         description: Server error
 */
router.get("/:studentId", authMiddleware, getStudentFeeById);

// Multer configuration for file uploads
const upload = multer({
    dest: 'uploads/', // Save files temporarily in the 'uploads' folder
  });
  /**
 * @swagger
 * /api/students/upload-students:
 *   post:
 *     summary: Upload multiple students from an Excel file
 *     tags: [Student Fees]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel file containing student data
 *     responses:
 *       201:
 *         description: Students added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 createdStudents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                       studentFeeId:
 *                         type: string
 *       400:
 *         description: Bad request, e.g., file missing or invalid
 *       500:
 *         description: Internal server error
 */
  // Route to add students from Excel
  router.post('/upload-students', upload.single('file'), resolveTenantConnection, addStudentsFromExcel);

/**
 * @swagger
 * /api/students/details:
 *   get:
 *     summary: Get details of all students
 *     tags: [Student Fees]
 *     responses:
 *       200:
 *         description: Successfully fetched student details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   studentId:
 *                     type: string
 *                     example: "12345"
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   fees:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         yearSem:
 *                           type: string
 *                           example: "1-1"
 *                         tuitionFee:
 *                           type: number
 *                           example: 50000
 *       500:
 *         description: Internal server error
 */
router.get('/details', resolveTenantConnection, getAllStudentsWithDetails); // Get all students with details

/**
 * @swagger
 * /api/students/search-details:
 *   get:
 *     summary: Search for students with specific details
 *     tags: [Student Fees]
 *     parameters:
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: string
 *         required: false
 *         description: ID of the student
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Name of the student
 *       - in: query
 *         name: yearSem
 *         schema:
 *           type: string
 *         required: false
 *         description: Year and semester of the student (e.g., "1-1")
 *     responses:
 *       200:
 *         description: Successfully fetched matching students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   studentId:
 *                     type: string
 *                     example: "12345"
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   yearSem:
 *                     type: string
 *                     example: "1-1"
 *                   tuitionFee:
 *                     type: number
 *                     example: 50000
 *       404:
 *         description: No matching students found
 *       500:
 *         description: Internal server error
 */
router.get('/search-details', resolveTenantConnection, searchStudentsWithDetails); // Search students with details

module.exports = router;
