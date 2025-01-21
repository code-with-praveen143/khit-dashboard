const logger = require("../utils/logger");
const XLSX = require("xlsx");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { performance } = require("perf_hooks");
const fs = require("fs");
const User = require("../models/User");
// Helper function to get the StudentFee model from the tenant connection
const getStudentFeeModel = (tenantDb) => {
  if (!tenantDb) {
    throw new Error(
      "Tenant database is not initialized. Ensure tenantDb is set in the middleware."
    );
  }

  let StudentFee;
  try {
    StudentFee = tenantDb.model("StudentFee");
  } catch (error) {
    const { studentFeeSchema } = require("../models/StudentFee");
    StudentFee = tenantDb.model("StudentFee", studentFeeSchema);
  }
  return StudentFee;
};

// Helper function to get the User model from the tenant connection
const getUserModel = (tenantDb) => {
  let User;
  try {
    User = tenantDb.model("User");
  } catch (error) {
    // Model not registered on this connection, so register it
    const UserModel = require("../models/User"); // Require the model file
    const userSchema = UserModel.schema; // Get the schema from the model
    User = tenantDb.model("User", userSchema);
  }
  return User;
};

// Add a new student fee record
const addStudentFee = async (req, res) => {
  try {
    const StudentFee = getStudentFeeModel(req.tenantDb);
    const { studentId, fees } = req.body;

    const studentFee = new StudentFee({ studentId, fees });
    await studentFee.save();

    logger.info(`Student fee record added for studentId: ${studentId}`);
    res
      .status(201)
      .json({ message: "Student fee record added successfully", studentFee });
  } catch (error) {
    logger.error(`Error adding student fee record: ${error.message}`);
    res.status(500).json({ message: "Error adding student fee record" });
  }
};

// Get all student fee records
const getStudentFees = async (req, res) => {
  try {
    const StudentFee = req.tenantDbStudentFee

    const studentFees = await StudentFee.find().populate(
      "studentId",
      "name email"
    );
    res.status(200).json(studentFees);
  } catch (error) {
    logger.error(`Error fetching student fee records: ${error.message}`);
    res.status(500).json({ message: "Error fetching student fee records" });
  }
};

//Get student fee by student ID
const getStudentFeeById = async (req, res) => {
  try {
    console.log("Request Params:", req.params); // Log request params
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const StudentFee = req.tenantDbStudentFee;
    const studentFee = await StudentFee.findOne({ studentId }).populate(
      "studentId",
      "name email"
    );

    if (!studentFee) {
      return res.status(404).json({ message: "Student fee record not found" });
    }

    res.status(200).json(studentFee);
  } catch (error) {
    logger.error(`Error fetching fee record for student ID ${req.params.studentId}: ${error.message}`);
    res.status(500).json({ message: "Error fetching fee record for the student" });
  }
};




// Update a student's fee record
const updateStudentFee = async (req, res) => {
  try {
    const StudentFee = getStudentFeeModel(req.tenantDb);
    const { id } = req.params;
    const { yearSem, remainingFee } = req.body;

    const studentFee = await StudentFee.findOneAndUpdate(
      { studentId: id, "fees.yearSem": yearSem },
      { $set: { "fees.$.remainingFee": remainingFee } },
      { new: true }
    );

    if (!studentFee) {
      return res.status(404).json({ message: "Student fee record not found" });
    }

    logger.info(
      `Student fee record updated for studentId: ${id}, yearSem: ${yearSem}`
    );
    res
      .status(200)
      .json({ message: "Student fee record updated successfully", studentFee });
  } catch (error) {
    logger.error(`Error updating student fee record: ${error.message}`);
    res.status(500).json({ message: "Error updating student fee record" });
  }
};

// Add multiple students from Excel
const addStudentsFromExcel = async (req, res) => {
  const startTime = performance.now();

  try {
    if (!req.file) {
      logger.warn("No file uploaded.");
      return res.status(400).json({ message: "No file uploaded." });
    }

    const User = req.tenantDbUser;
    const StudentFee = req.tenantDbStudentFee;
    const filePath = req.file.path;

    // Parse the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (data.length === 0) {
      logger.warn("Uploaded Excel file is empty.");
      return res.status(400).json({ message: "Excel file is empty." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const batchSize = 100;
    const createdStudents = [];
    const rowErrors = [];

    // Pre-compute default hashed password
    const defaultPassword = await bcrypt.hash("defaultPassword123", 10);

    // Fetch all existing emails in a single query
    const existingUsers = await User.find({}, { email: 1 }).lean();
    const existingEmails = new Set(existingUsers.map((user) => user.email));

    logger.info("Fetched existing users for validation.");

    const processBatch = async (batch) => {
      const userBulkOps = [];
      const feeBulkOps = [];

      for (const row of batch) {
        const errors = [];
        const email = row["email"] || "";

        // Validate required fields
        if (!row["studentname"]) {
          errors.push("Missing student name.");
        }
        if (!email || !emailRegex.test(email)) {
          errors.push("Invalid or missing email.");
        }
        if (existingEmails.has(email)) {
          errors.push("Email already exists.");
        }

        if (errors.length > 0) {
          rowErrors.push({ row, errors });
        }

        // Default values for missing data
        const userId = new mongoose.Types.ObjectId();

        userBulkOps.push({
          insertOne: {
            document: {
              _id: userId,
              name: row["studentname"] || "Unknown Student",
              email: email || `unknown${userId}@example.com`,
              password: defaultPassword,
              role: "student",
            },
          },
        });

        feeBulkOps.push({
          insertOne: {
            document: {
              studentId: userId,
              academicYear: row["ay"] || null,
              yearSem: row["yearSem"] || null,
              admissionMode: row["admissionMode"] || "Unknown",
              rollno: row["rollno"] || null,
              scholarshipId: row["scholarshipId"] || null,
              entryYear: row["EntryYear"] || null,
              Department: row["specialization"] || null,
              category: row["category"] || "Unknown",
              caste: row["caste"] || "Unknown",
              gender: row["gender"] || "Unknown",
              course: row["course"] || "Unknown",

              aadharNumber: row["aadharNumber"] || null,
              phoneNumber: row["phoneNumber"] || null,

              parentNumbers: {
                parent1: row["parentNumber1"] || null,
                parent2: row["parentNumber2"] || null,
              },
              feePaidByGovt: row["fee_govt"] || 0,
              feePaidByStudent: row["fee_student"] || 0,
            },
          },
        });

        createdStudents.push({ email, userId });
        existingEmails.add(email);
      }

      // Perform bulk operations
      await Promise.all([
        userBulkOps.length > 0
          ? User.bulkWrite(userBulkOps)
          : Promise.resolve(),
        feeBulkOps.length > 0
          ? StudentFee.bulkWrite(feeBulkOps)
          : Promise.resolve(),
      ]);
    };

    // Split data into batches and process them in parallel
    const batches = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }

    logger.info(`Processing ${batches.length} batches.`);

    await Promise.all(batches.map((batch) => processBatch(batch)));

    fs.unlinkSync(filePath); // Clean up the uploaded file

    const endTime = performance.now();
    logger.info(
      `Processing completed in ${(endTime - startTime).toFixed(2)} ms.`
    );

    res.status(201).json({
      message: "Processing complete.",
      createdStudents,
      rowErrors,
    });
  } catch (error) {
    const endTime = performance.now();
    logger.error(
      `Error processing file in ${(endTime - startTime).toFixed(2)} ms: ${
        error.stack
      }`
    );
    res.status(500).json({
      message: "Error processing the file.",
      error: error.message,
    });
  }
};

// Get all students with detailed information from User and StudentFee
const getAllStudentsWithDetails = async (req, res) => {
  try {
    const User = getUserModel(req.tenantDbUser);
    const StudentFee = getStudentFeeModel(req.tenantDbStudentFee);

    // Aggregate to fetch all details
    const students = await User.aggregate([
      {
        $lookup: {
          from: "StudentFee", // Name of the StudentFee collection
          localField: "_id", // User's ID field
          foreignField: "studentId", // StudentFee's reference field
          as: "fees", // Alias for the joined data
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          fees: 1, // Include all fields from the StudentFee model
        },
      },
    ]);

    if (!students.length) {
      return res.status(404).json({ message: "No students found." });
    }

    res.status(200).json({ students });
  } catch (error) {
    logger.error(`Error fetching students with details: ${error.message}`);
    res.status(500).json({ message: "Error fetching students with details" });
  }
};
// Search students with details from User and StudentFee
const searchStudentsWithDetails = async (req, res) => {
  try {
    const User = getUserModel(req.tenantDb);
    const StudentFee = getStudentFeeModel(req.tenantDb);

    // Extract query parameters
    const { name, email, rollno, course, category } = req.query;

    // Build dynamic query
    const userQuery = {};
    const feeQuery = {};

    if (name) userQuery.name = new RegExp(name, "i"); // Case-insensitive search for User name
    if (email) userQuery.email = new RegExp(email, "i"); // Case-insensitive search for email
    if (rollno) feeQuery.rollno = rollno; // Exact match for roll number
    if (course) feeQuery.course = new RegExp(course, "i"); // Case-insensitive search for course
    if (category) feeQuery.category = new RegExp(category, "i"); // Case-insensitive search for category

    const students = await User.aggregate([
      {
        $lookup: {
          from: "studentfees", // Name of the StudentFee collection
          localField: "_id",
          foreignField: "studentId",
          as: "fees",
        },
      },
      {
        $match: userQuery, // Match User-level fields
      },
      {
        $match: {
          $or: [
            feeQuery, // Match StudentFee-level fields
          ],
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          fees: 1, // Include all StudentFee data
        },
      },
    ]);

    if (!students.length) {
      return res.status(404).json({ message: "No matching students found." });
    }

    res.status(200).json({ students });
  } catch (error) {
    logger.error(`Error searching students with details: ${error.message}`);
    res.status(500).json({ message: "Error searching students with details" });
  }
};

module.exports = {
  addStudentFee,
  getStudentFees,
  updateStudentFee,
  addStudentsFromExcel,
  getAllStudentsWithDetails,
  searchStudentsWithDetails,
  getStudentFeeById
};
