"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AttendanceDetails() {
    const [attendanceData, setAttendanceData] = useState({
        currentClasses: 0,
        classesHeld: 0,
        bunkableClasses: 0,
        attendancepercentage: 0
    })
    const [rollNumber, setRollNumber] = useState('')
    const router = useRouter()

    useEffect(() => {
        const storedRollNumber = localStorage.getItem('rollNumber')
        if (!storedRollNumber) {
            router.push('/')
            return
        }
        setRollNumber(storedRollNumber)

        fetch(`/api/attendance?rollNumber=${storedRollNumber}`)
            .then(res => res.json())
            .then(data => {
                const bunkable = calculateBunkableClasses(data.attendancePercentage, data.currentclasses, data.classesheld)
                setAttendanceData({
                    currentClasses: data.currentclasses,
                    classesHeld: data.classesheld,
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
        <Card className="w-full max-w-md mx-auto border-background">
            <CardHeader>
                <CardTitle>Attendance Details (BETA)</CardTitle>
                <CardDescription>Roll Number: {rollNumber}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Metric</TableHead>
                            <TableHead className="text-right">Value</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Classes Attended</TableCell>
                            <TableCell className="text-right">{attendanceData.currentClasses}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Total Classes Held</TableCell>
                            <TableCell className="text-right">{attendanceData.classesHeld}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                {attendanceData.attendancepercentage >= 75 ? "Classes You Can Bunk (for 76%)" : "Classes to Attend (for 76%)"}
                            </TableCell>
                            <TableCell className="text-right">
                                {Math.abs(attendanceData.bunkableClasses).toFixed(2)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <Button variant="destructive" onClick={handleLogout} className="w-full">
                    Logout
                </Button>
            </CardFooter>
        </Card>
    )
}