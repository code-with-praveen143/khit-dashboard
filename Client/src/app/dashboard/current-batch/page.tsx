'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// Mock hook for fetching data
import { useGetStudentFees } from '@/app/hooks/students/useGetStudents'

interface StudentFee {
  Department: string
  rollno: string
}

// Background colors for departments
const departmentColors: Record<string, string> = {
  ECE: 'bg-blue-200',
  CSE: 'bg-red-200',
  EEE: 'bg-yellow-200',
  Bio: 'bg-purple-200',
  MECH: 'bg-green-200',
  IT: 'bg-pink-200',
}

const DepartmentGrid: React.FC = () => {
  const { data, isLoading, isError } = useGetStudentFees()

  // Group and calculate section data
  const groupedData = useMemo(() => {
    if (!data) return {}

    return data.reduce((acc: any, student: StudentFee) => {
      const year = getYearFromRollNo(student.rollno)
      const { Department } = student

      if (!acc[year]) acc[year] = {}
      if (!acc[year][Department]) acc[year][Department] = []

      acc[year][Department].push(student)
      return acc
    }, {})
  }, [data])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (isError) {
    return <ErrorMessage />
  }

  return (
    <div className="p-4 space-y-8">
      {Object.entries(groupedData).map(([year, departments], index) => (
        <motion.div
          key={year}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold border-b pb-2 mb-4">{`Year: ${year}`}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(departments as Record<string, StudentFee[]>).map(([department, students]) => (
              <DepartmentCard
                key={department}
                department={department}
                students={students}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

const DepartmentCard: React.FC<{
  department: string
  students: StudentFee[]
}> = ({ department, students }) => {
  // Calculate section counts
  const sectionCounts = calculateSectionCounts(students.length)

  return (
    <Card className={`overflow-hidden ${departmentColors[department] || 'bg-gray-200'}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{department}</span>
          <span className="text-gray-500">{students.length}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(sectionCounts).map(([section, count]) => (
            <div
              key={section}
              className="flex flex-col items-center justify-center p-2 border rounded-lg bg-white"
            >
              <div className="text-lg font-bold">{section}</div>
              <div className="text-sm text-gray-600">{count} Students</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Utility to calculate section counts
const calculateSectionCounts = (totalStudents: number) => {
  const sections = ['A', 'B', 'C', 'D']
  const baseCount = Math.floor(totalStudents / 4)
  const remainder = totalStudents % 4

  const counts: Record<string, number> = sections.reduce((acc: Record<string, number>, section) => {
    acc[section] = baseCount
    return acc
  }, {})

  // Distribute the remainder
  for (let i = 0; i < remainder; i++) {
    counts[sections[i]] += 1
  }

  return counts
}

// Mock helper for year extraction
const getYearFromRollNo = (rollno: string): string => {
  // Example logic for extracting year based on roll number
  const yearCode = rollno.slice(0, 2) // Adjust as per roll number structure
  const yearMapping: Record<string, string> = {
    '22': 'Final Year (2022 - 2026)',
    '23': 'Third Year (2023 - 2027)',
    '24': 'Second Year (2024 - 2028)',
    '25': 'First Year (2025 - 2029)',
  }
  return yearMapping[yearCode] || 'Unknown Year'
}

// Skeleton for loading state
const LoadingSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="w-full h-24 bg-gray-200 rounded-md animate-pulse"></div>
    ))}
  </div>
)

// Error message
const ErrorMessage = () => (
  <div className="text-red-500 text-center">Failed to load data</div>
)

export default DepartmentGrid
