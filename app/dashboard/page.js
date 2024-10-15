'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp } from "lucide-react"
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

export const description = "A radial chart with text"

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
}

export default function Dashboard() {
    const [attendance, setAttendance] = useState(null)
    const [rollNumber, setRollNumber] = useState(null)
    const router = useRouter()

    useEffect(() => {
        // Retrieve the roll number from localStorage
        const storedRollNumber = localStorage.getItem('rollNumber')
        if (!storedRollNumber) {
            // If no roll number is found, redirect to login page
            router.push('/')
            return
        }
        setRollNumber(storedRollNumber)

        // Fetch attendance data
        fetch(`/api/attendance?rollNumber=${storedRollNumber}`)
            .then(res => res.json())
            .then(data => setAttendance(data.attendancePercentage))
            .catch(error => {
                console.error('Error fetching attendance:', error)
                setAttendance(null)
            })
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('rollNumber')
        router.push('/')
    }

    if (!rollNumber || attendance === null) {
        return <div>Loading attendance data...</div>
    }

    // Create chartData based on the fetched attendance
    const chartData = [
        {
            visitors: attendance || 0, // Use attendance value
        }
    ]

    return (
        <Card className="flex flex-col bg-black border-black">
            <CardHeader className="items-center pb-0">
                {/* <CardTitle>Radial Chart - Text</CardTitle> */}
                <CardDescription>Attendance Overview</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RadialBarChart
                        data={chartData}
                        startAngle={0}
                        endAngle={250}
                        innerRadius={80}
                        outerRadius={110}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-muted last:fill-background"
                            polarRadius={[86, 74]}
                        />
                        <RadialBar
                            dataKey="visitors"
                            background
                            cornerRadius={10}
                            fill="green"  // Set the color to green
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-4xl font-bold"
                                                >
                                                    {chartData[0].visitors.toLocaleString()}%
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Attendance
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    {/* Trending up by 5.2% this month <TrendingUp className="h-4 w-4" /> */}
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing your attendance data
                </div>
                <button onClick={handleLogout} className="p-2 bg-red-600 text-white rounded">
                    Logout
                </button>
            </CardFooter>
        </Card>
    )
}
