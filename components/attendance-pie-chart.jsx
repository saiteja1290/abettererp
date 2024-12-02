"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"

export default function AttendancePieChart() {
    const [attendance, setAttendance] = useState(0)
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
                setAttendance(data.attendancePercentage)
            })
            .catch(error => {
                console.error('Error fetching attendance:', error)
                setAttendance(0)
            })
    }, [router])

    // Default color for attendance chart
    let chartColor = attendance < 75 ? "#f44336" : "#22c55e"
    if (rollNumber === '160121748022') {
        chartColor = '#c084fc'
    }

    const chartData = [
        {
            attendance: attendance,
        }
    ]

    return (
        <Card className="w-full max-w-md mx-auto border-card">
            <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>Roll Number: {rollNumber}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        attendance: {
                            label: "Attendance",
                            color: chartColor, // Use the dynamic color here
                        },
                    }}
                    className="aspect-square w-full max-w-[300px] mx-auto"
                >
                    <RadialBarChart
                        data={chartData}
                        startAngle={0}
                        endAngle={360}
                        innerRadius={80}
                        outerRadius={110}
                    >
                        <PolarAngleAxis
                            type="number"
                            domain={[0, 100]}
                            angleAxisId={0}
                            tick={false}
                        />
                        <RadialBar
                            background
                            dataKey="attendance"
                            angleAxisId={0}
                            fill={chartColor} // Apply the dynamic color
                            cornerRadius={10}
                        />
                        <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-foreground text-3xl font-bold"
                        >
                            {attendance.toFixed(2)}%
                        </text>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
