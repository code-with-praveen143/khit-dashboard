const mongoose = require('mongoose');

const studentFeeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Links to User
  academicYear: { type: String, required: true }, // E.g., "2023-2024"
  yearSem: { type: String,  }, // Combines year and semester, e.g., "1-1", "1-2"
  admissionMode: { type: String, required: true }, // E.g., "Management Quota", "Counseling"
  scholarshipId: { type: String }, // Scholarship ID if applicable
  entryYear: { 
    type: Number, 
    required: true, 
    default: 1, 
    enum: [1, 2], // Only allows 1 or 3
  }, // The year student entered the course (e.g., 1 for regular, 2 for lateral)
  scholarshipId: { type: String }, // Scholarship ID if applicable
  category: { type: String, required: true }, // E.g., "SC", "ST", "OBC", "General"
  caste: { type: String }, // E.g., "Kuruba", "Lingayat"
  gender: { type: String, enum: ['MALE', 'FEMALE', 'Other'], required: true }, // Gender of the student
  rollno:{type: String},
  course: { type: String, required: true }, // E.g., "Bachelor of Technology", "Master of Business Administration"
  Deparment: { type: String  }, // E.g., "Mechanical", "CSE"
  aadharNumber: { type: String,  }, // Unique ID for the student
  phoneNumber: { type: String,  }, // Student's contact number
  parentNumbers: {
    parent1: { type: String,  }, // Parent's primary contact number
    parent2: { type: String }, // Optional second parent contact number
  },
  feePaidByGovt: { type: Number, default: 0 }, // Total amount paid by the government
  feePaidByStudent: { type: Number, default: 0 }, // Total amount paid by the student
  tuitionFees: [
    {
      yearSem: { type: String, required: true }, // Combines year and semester, e.g., "1-1", "1-2"
      totalFee: { type: Number, required: true }, // Total fee for this semester
      feePaidByGovt: { type: Number, default: 0 }, // Amount paid by the government for this semester
      feePaidByStudent: { type: Number, default: 0 }, // Amount paid by the student
      remainingFee: { type: Number, required: true }, // Remaining fee for this semester
    },
  ],
  specialFees: [
    {
      yearSem: { type: String, required: true }, // Year and semester for the special fee, e.g., "1-1"
      description: { type: String }, // Description of the fee
      amount: { type: Number }, // Special fee amount
      paid: { type: Boolean, default: false }, // Whether the fee is paid
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = studentFeeSchema;