"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export default function StudentRegistrationForm() {
  const [tuitionFees, setTuitionFees] = useState([
    {
      yearSem: "",
      totalFee: 0,
      feePaidByGovt: 0,
      feePaidByStudent: 0,
      remainingFee: 0,
    },
  ]);
  const [specialFees, setSpecialFees] = useState([
    { yearSem: "", description: "", amount: 0, paid: false },
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission here
    console.log("Form submitted");
  };

  const addTuitionFee = () => {
    setTuitionFees([
      ...tuitionFees,
      {
        yearSem: "",
        totalFee: 0,
        feePaidByGovt: 0,
        feePaidByStudent: 0,
        remainingFee: 0,
      },
    ]);
  };

  const addSpecialFee = () => {
    setSpecialFees([
      ...specialFees,
      { yearSem: "", description: "", amount: 0, paid: false },
    ]);
  };

  return (
    <div className="min-h-screen p-4">
      <Card className="w-full max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-2xl font-bold">
            Student Registration
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Input id="academicYear" name="academicYear" required />
                </div>
                <div>
                  <Label htmlFor="yearSem">Year/Semester</Label>
                  <Input id="yearSem" name="yearSem" />
                </div>
                <div>
                  <Label htmlFor="admissionMode">Admission Mode</Label>
                  <Input id="admissionMode" name="admissionMode" required />
                </div>
                <div>
                  <Label htmlFor="scholarshipId">Scholarship ID</Label>
                  <Input id="scholarshipId" name="scholarshipId" />
                </div>
                <div>
                  <Label htmlFor="entryYear">Entry Year</Label>
                  <Select name="entryYear">
                    <SelectTrigger>
                      <SelectValue placeholder="Select entry year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" required />
                </div>
                <div>
                  <Label htmlFor="caste">Caste</Label>
                  <Input id="caste" name="caste" />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select name="gender">
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rollno">Roll Number</Label>
                  <Input id="rollno" name="rollno" />
                </div>
                <div>
                  <Label htmlFor="course">Course</Label>
                  <Input id="course" name="course" required />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" name="department" />
                </div>
                <div>
                  <Label htmlFor="aadharNumber">Aadhar Number</Label>
                  <Input id="aadharNumber" name="aadharNumber" />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" name="phoneNumber" />
                </div>
                <div>
                  <Label htmlFor="parent1">Parent 1 Number</Label>
                  <Input id="parent1" name="parentNumbers.parent1" />
                </div>
                <div>
                  <Label htmlFor="parent2">Parent 2 Number</Label>
                  <Input id="parent2" name="parentNumbers.parent2" />
                </div>
                <div>
                  <Label htmlFor="feePaidByGovt">Fee Paid By Government</Label>
                  <Input
                    id="feePaidByGovt"
                    name="feePaidByGovt"
                    type="number"
                    defaultValue={0}
                  />
                </div>
                <div>
                  <Label htmlFor="feePaidByStudent">Fee Paid By Student</Label>
                  <Input
                    id="feePaidByStudent"
                    name="feePaidByStudent"
                    type="number"
                    defaultValue={0}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Tuition Fees</h3>
                {tuitionFees.map((fee, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-4"
                  >
                    <Input
                      placeholder="Year/Sem"
                      name={`tuitionFees[${index}].yearSem`}
                      required
                    />
                    <Input
                      placeholder="Total Fee"
                      name={`tuitionFees[${index}].totalFee`}
                      type="number"
                      required
                    />
                    <Input
                      placeholder="Paid by Govt"
                      name={`tuitionFees[${index}].feePaidByGovt`}
                      type="number"
                      defaultValue={0}
                    />
                    <Input
                      placeholder="Paid by Student"
                      name={`tuitionFees[${index}].feePaidByStudent`}
                      type="number"
                      defaultValue={0}
                    />
                    <Input
                      placeholder="Remaining Fee"
                      name={`tuitionFees[${index}].remainingFee`}
                      type="number"
                      required
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addTuitionFee}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Add Tuition Fee
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Special Fees</h3>
                {specialFees.map((fee, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4"
                  >
                    <Input
                      placeholder="Year/Sem"
                      name={`specialFees[${index}].yearSem`}
                      required
                    />
                    <Input
                      placeholder="Description"
                      name={`specialFees[${index}].description`}
                    />
                    <Input
                      placeholder="Amount"
                      name={`specialFees[${index}].amount`}
                      type="number"
                    />
                    <Select name={`specialFees[${index}].paid`}>
                      <SelectTrigger>
                        <SelectValue placeholder="Paid?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addSpecialFee}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Add Special Fee
                </Button>
              </div>

              <Button type="submit" className="w-full">
                Submit Registration
              </Button>
            </form>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <p className="text-center text-slate-900 w-full">
            Already have an account? <Link href="/" className="text-blue-500 hover:cursor-pointer hover:underline">Login</Link>
          </p>
        </CardFooter> 
      </Card>
    </div>
  );
}
