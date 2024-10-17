'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
    const [currentClasses, setCurrentClasses] = useState(0)
    const [bunkableClasses, setBunkableClasses] = useState(0)
    const [classesheld, setClassesHeld] = useState(0)
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

        // Fetch attendance and current classes data
        fetch(`/api/attendance?rollNumber=${storedRollNumber}`)
            .then(res => res.json())
            .then(data => {
                setAttendance(data.attendancePercentage)
                setCurrentClasses(data.currentclasses)
                calculateBunkableClasses(data.attendancePercentage, data.currentclasses, data.classesheld)
                setClassesHeld(data.classesheld)
            })
            .catch(error => {
                console.error('Error fetching attendance:', error)
                setAttendance(null)
            })
    }, [router])

    // Function to calculate bunkable classes based on attendance percentage
    const calculateBunkableClasses = (attendancePercentage, currentClasses, classesheld) => {
        let bunkable;

        if (attendancePercentage < 75) {
            // Calculate classes you may bunk if attendance is below 75%
            bunkable = 4.16 * ((0.76 * parseInt(classesheld)) - currentClasses)
        }
        else if (attendancePercentage === 75) {
            bunkable = 0
        }
        else {
            // Calculate classes you may bunk if attendance is above 75%
            bunkable = -4.16 * ((0.76 * parseInt(classesheld)) - currentClasses)
        }
        setBunkableClasses(bunkable)
    }

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
        <Card className="flex flex-col bg-baground border-background">
            <CardHeader className="items-center pb-0">
                <CardDescription>Attendance Overview</CardDescription>
                <CardDescription>{rollNumber}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RadialBarChart
                        data={chartData}
                        startAngle={0}
                        endAngle={360 * (chartData[0].visitors / 100)}  // Dynamically calculate the end angle
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
                            fill="white"
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
                <div className="leading-none text-muted-foreground">
                    Showing your attendance data
                </div>
                {attendance < 75 ? (
                    <div className="leading-none text-muted-foreground">
                        Classes you need to attend: {bunkableClasses.toFixed(2)}
                    </div>
                ) : (
                    <div className="leading-none text-muted-foreground">
                        Classes you can bunk: {bunkableClasses.toFixed(2)}
                    </div>
                )}

                <div className="leading-none text-muted-foreground">
                    Attended Classes: {currentClasses}
                    {/* Current Classes: {currentClasses} */}
                </div>
                <div className="leading-none text-muted-foreground">
                    Classes Held: {classesheld}
                    {/* Current Classes: {currentClasses} */}
                </div>
                <button onClick={handleLogout} className="p-2 bg-red-600 text-white rounded">
                    Logout
                </button>
            </CardFooter>
        </Card>
    )
}
