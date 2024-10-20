"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AttendanceLeaderboard() {
    const [attendanceData, setAttendanceData] = useState({
        currentClasses: 0,
        classesHeld: 0,
        bunkableClasses: 0,
        attendancePercentage: 0
    })
    const [userAttendance, setUserAttendance] = useState(0)
    const [rollNumber, setRollNumber] = useState('')
    const [leaderboardData, setLeaderboardData] = useState([])
    const router = useRouter()

    useEffect(() => {
        const storedRollNumber = localStorage.getItem('rollNumber')
        if (!storedRollNumber) {
            router.push('/')
            return
        }

        setRollNumber(storedRollNumber)
        const stringStoredRollNumber = storedRollNumber.toString()
        let section = ""
        if (stringStoredRollNumber.includes("748")) {
            section = "CSM"
        } else if (stringStoredRollNumber.includes("729")) {
            section = "CSE 5"
        } else if (160121733001 <= stringStoredRollNumber && stringStoredRollNumber <= 160121733065 || 160121733301 <= stringStoredRollNumber && stringStoredRollNumber <= 160121733306) {
            section = "CSE 1"
        } else if (160121733071 <= stringStoredRollNumber && stringStoredRollNumber <= 160121733134 || 160121733307 <= stringStoredRollNumber && stringStoredRollNumber <= 160121733313) {
            section = "CSE 2"
        } else {
            section = "CSE 3"
        }

        fetch(`/api/attendanceleaderboard?section=${section}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setLeaderboardData(Object.entries(data.collection[section]))  // Convert the object into an array of key-value pairs
            })
            .catch(error => {
                console.error('Error fetching attendance:', error)
            })
    }, [router])

    const calculateBunkableClasses = (attendancePercentage, currentClasses, classesHeld) => {
        setUserAttendance(attendancePercentage)
        if (attendancePercentage < 75) {
            return 4.16 * ((0.76 * parseInt(classesHeld)) - currentClasses)
        } else if (attendancePercentage === 75) {
            return 0
        } else {
            return 1.31 * (currentClasses - (0.76 * parseInt(classesHeld)))
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('rollNumber')
        router.push('/')
    }

    return (
        <>
            <Card className="h-full border-background">
                <CardHeader>
                    <CardTitle>Attendance Leaderboard</CardTitle>
                    <CardDescription>Section-wise leaderboard</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead >Rank</TableHead>
                                <TableHead>Roll Number</TableHead>
                                <TableHead>Attendance Percentage</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                leaderboardData.map(([rollNumber_, attendancePercentage_], index) => {
                                    // Determine the row color based on attendance percentage
                                    let rowStyle = {};
                                    if (attendancePercentage_ >= 90) {
                                        rowStyle = { backgroundColor: "#22c55e" }; // Light green for 90% and above

                                    } else if (attendancePercentage_ >= 75 && attendancePercentage_ < 90) {
                                        rowStyle = { backgroundColor: "#FFF3CD" }; // Light yellow for 75% to 85%
                                    } else if (attendancePercentage_ >= 65 && attendancePercentage_ < 75) {
                                        rowStyle = { backgroundColor: "#FDE2C4" }; // Light orange for 65% to 75%
                                    } else {
                                        rowStyle = { backgroundColor: "#f87171" }; // Light red for below 65%
                                    }

                                    return (
                                        <TableRow key={rollNumber_} style={rollNumber_ === rollNumber ? { ...rowStyle, border: '4px solid #991b1b' } : rowStyle}>
                                            <TableCell className="text-black">{index + 1}</TableCell> {/* Display the rank */}
                                            <TableCell className="text-black">{rollNumber_}</TableCell>
                                            <TableCell className="text-black">{attendancePercentage_}%</TableCell>
                                        </TableRow>
                                    );
                                })
                            }
                        </TableBody>

                    </Table>
                </CardContent>
            </Card>
        </>
    )
}
