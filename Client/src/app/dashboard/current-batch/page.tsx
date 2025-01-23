'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { StudentFee } from '@/app/@types/student'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useGetStudentFees } from '@/app/hooks/students/useGetStudents'
import { Skeleton } from '@/components/ui/skeleton'

const DepartmentGrid: React.FC = () => {
  const { data, isLoading, isError } = useGetStudentFees()

  // Group students by branch and section
  const groupedData = useMemo(() => {
    if (!data) return {}

    return data.reduce((acc, student) => {
      const { course, rollno } = student
      const section = rollno.slice(-1).toUpperCase() // Extract section from roll number (e.g., A, B, C, D)

      if (!acc[course]) {
        acc[course] = {}
      }
      if (!acc[course][section]) {
        acc[course][section] = []
      }
      acc[course][section].push(student)
      return acc
    }, {} as Record<string, Record<string, StudentFee[]>>)
  }, [data])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (isError) {
    return <ErrorMessage />
  }

  return (
    <div className="p-4 space-y-8">
      {Object.entries(groupedData).map(([branch, sections], index) => (
        <motion.div
          key={branch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <h2 className="text-2xl font-bold mb-4">{branch}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['A', 'B', 'C', 'D'].map((section) => (
              <SectionCard
                key={section}
                branch={branch}
                section={section}
                students={sections[section] || []}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

const SectionCard: React.FC<{
  branch: string
  section: string
  students: StudentFee[]
}> = ({ branch, section, students }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{`Section ${section}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{students.length}</div>
        <div className="text-sm text-gray-500">Students</div>
      </CardContent>
    </Card>
  )
}

const LoadingSkeleton: React.FC = () => (
  <div className="p-4 space-y-8">
    {[1, 2].map((group) => (
      <div key={group} className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((card) => (
            <Skeleton key={card} className="h-24" />
          ))}
        </div>
      </div>
    ))}
  </div>
)

const ErrorMessage: React.FC = () => (
  <div className="flex items-center justify-center h-screen">
    <Card className="w-96">
      <CardHeader>
        <CardTitle className="text-red-600">Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p>There was an error loading the data. Please try again later.</p>
      </CardContent>
    </Card>
  </div>
)

export default DepartmentGrid