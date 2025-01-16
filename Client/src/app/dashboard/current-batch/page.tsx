'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { StudentFee } from '@/app/@types/student'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useGetStudentFees } from '@/app/hooks/students/useGetStudents'
import { Skeleton } from '@/components/ui/skeleton'

const DepartmentGrid: React.FC = () => {
  const { data, isLoading, isError } = useGetStudentFees()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'count'>('name')

  const groupedData = useMemo(() => {
    if (!data) return {}

    return data.reduce((acc, student) => {
      const { academicYear, course } = student
      if (!acc[academicYear]) {
        acc[academicYear] = {}
      }
      if (!acc[academicYear][course]) {
        acc[academicYear][course] = { count: 0, students: [] }
      }
      acc[academicYear][course].count++
      acc[academicYear][course].students.push(student)
      return acc
    }, {} as Record<string, Record<string, { count: number; students: StudentFee[] }>>)
  }, [data])

  const yearGroups = useMemo(() => {
    return Object.entries(groupedData)
      .filter(([year]) => !selectedYear || year === selectedYear)
      .map(([year, departments]) => ({
        year,
        departments: Object.entries(departments)
          .filter(([name]) =>
            name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(([name, details]) => ({
            name,
            count: details.count,
            sections: ['A', 'B', 'C', 'D'], // Example sections
            color: `bg-${
              ['blue', 'green', 'yellow', 'purple', 'pink'][
                Math.floor(Math.random() * 5)
              ]
            }-100`,
          }))
          .sort((a, b) =>
            sortBy === 'name'
              ? a.name.localeCompare(b.name)
              : b.count - a.count
          ),
      }))
      .sort((a, b) => b.year.localeCompare(a.year))
  }, [groupedData, searchTerm, selectedYear, sortBy])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (isError) {
    return <ErrorMessage />
  }

  return (
    <div className="p-4 space-y-8">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search departments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />
        <Select
          value={selectedYear || ''}
          onValueChange={(value) => setSelectedYear(value || null)}
          // className="md:w-1/4"
        >
          <option value="">All Years</option>
          {Object.keys(groupedData).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as 'name' | 'count')}
          //className="md:w-1/4"
        >
          <option value="name">Sort by Name</option>
          <option value="count">Sort by Count</option>
        </Select>
      </div>
      {yearGroups.map((yearGroup, index) => (
        <motion.div
          key={yearGroup.year}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <h2 className="text-2xl font-bold mb-4">{yearGroup.year}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {yearGroup.departments.map((dept, deptIndex) => (
              <DepartmentCard key={deptIndex} department={dept} />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

const DepartmentCard: React.FC<{ department: any }> = ({ department }) => {
  const studentsPerSection = Math.floor(
    department.count / department.sections.length
  )

  return (
    <Card className={`${department.color} overflow-hidden`}>
      <CardHeader>
        <CardTitle>{department.name}</CardTitle>
        <CardDescription>Total Students: {department.count}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {department.sections.map((section:any, secIndex:any) => (
            <div
              key={secIndex}
              className="bg-white p-2 rounded-md text-center shadow-sm"
            >
              <div className="font-medium">Section {section}</div>
              <div className="text-sm text-gray-500">{studentsPerSection}</div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

const LoadingSkeleton: React.FC = () => (
  <div className="p-4 space-y-8">
    <div className="flex gap-4 mb-6">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-10 w-1/4" />
      <Skeleton className="h-10 w-1/4" />
    </div>
    {[1, 2].map((group) => (
      <div key={group} className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((card) => (
            <Skeleton key={card} className="h-48" />
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
      <CardFooter>
        <Button onClick={() => window.location.reload()} className="w-full">
          Retry
        </Button>
      </CardFooter>
    </Card>
  </div>
)

export default DepartmentGrid

