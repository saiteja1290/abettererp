"use client"

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import AttendanceDashboard from '@/components/attendance-dashboard'
import AttendanceDetails from '@/components/attendance-details'
import AttendancePieChart from '@/components/attendance-pie-chart'
export default function Component() {
    const [attendanceData, setAttendanceData] = useState({
        attendancePercentage: 0,
        currentClasses: 0,
        classesHeld: 0,
        rollNumber: '',
        bunkableClasses: 0,
    })
    const router = useRouter()

    useEffect(() => {
        const storedRollNumber = localStorage.getItem('rollNumber')
        if (!storedRollNumber) {
            router.push('/')
            return
        }

        fetch(`/api/attendance?rollNumber=${storedRollNumber}`)
            .then(res => res.json())
            .then(data => {
                const bunkable = calculateBunkableClasses(data.attendancePercentage, data.currentclasses, data.classesheld)
                setAttendanceData({
                    ...data,
                    rollNumber: storedRollNumber,
                    bunkableClasses: bunkable,
                })
            })
            .catch(error => {
                console.error('Error fetching attendance:', error)
            })
    }, [router])

    const calculateBunkableClasses = (attendancePercentage, currentClasses, classesHeld) => {
        if (attendancePercentage < 75) {
            return 4.16 * ((0.76 * parseInt(classesHeld)) - currentClasses)
        } else if (attendancePercentage === 75) {
            return 0
        } else {
            return -4.16 * ((0.76 * parseInt(classesHeld)) - currentClasses)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('rollNumber')
        router.push('/')
    }

    return (
        <div className="container mx-auto py-10">
            <div className='flex flex-col md:flex-row gap-0'>
                <div className="w-full md:w-1/2 order-2 md:order-1">
                    <AttendanceDetails
                        attendanceData={attendanceData}
                        handleLogout={handleLogout}
                    />
                </div>

                <div className="w-auto md:w-1/2 order-1 md:order-2">
                    <AttendancePieChart
                        attendance={attendanceData.attendancePercentage}
                        rollNumber={attendanceData.rollNumber}
                    />
                </div>
            </div>
        </div>
    )
}