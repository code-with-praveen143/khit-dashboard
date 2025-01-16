export interface ParentNumbers {
    parent1: string | null;
    parent2: string | null;
  }
  
  export interface Student {
    _id: string;
    name: string;
    email: string;
  }
  
  export interface StudentFee {
    _id: string;
    studentId: Student; // Reference to the student
    academicYear: string;
    yearSem: string | null;
    admissionMode: string;
    scholarshipId: string | null;
    entryYear: number;
    category: string;
    caste: string;
    gender: string;
    rollno: string;
    course: string;
    aadharNumber: string | null;
    phoneNumber: string | null;
    parentNumbers: ParentNumbers;
    feePaidByGovt: number;
    feePaidByStudent: number;
    tuitionFees: Array<{ type: string; amount: number }> | []; // Example: Tuition fees array
    specialFees: Array<{ type: string; amount: number }> | []; // Example: Special fees array
    createdAt: string;
    updatedAt: string;
  }
  