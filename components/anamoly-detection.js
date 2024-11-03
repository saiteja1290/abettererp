"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button"; // Import Button component

export default function AnomalyDetection() {
    const [attendanceData, setAttendanceData] = useState({});
    const [rollNumber, setRollNumber] = useState("");
    const [loading, setLoading] = useState(true);
    const [showFullReport, setShowFullReport] = useState(false); // State to toggle full report
    const router = useRouter();

    useEffect(() => {
        const storedRollNumber = localStorage.getItem("rollNumber");
        if (!storedRollNumber) {
            router.push("/");
            return;
        }
        setRollNumber(storedRollNumber);
        fetchAttendanceData(storedRollNumber);
    }, [router]);

    const fetchAttendanceData = async (rollNumber) => {
        try {
            const res = await fetch(`/api/attendance?rollNumber=${rollNumber}`);
            const data = await res.json();
            setAttendanceData(data.attendancedict);
        } catch (error) {
            console.error("Error fetching attendance:", error);
        } finally {
            setLoading(false);
        }
    };

    const checkForAnomalies = (attendanceString) => {
        // Anomaly is defined as having both "A" (absent) and "P" (present)
        return attendanceString.includes("A") && attendanceString.includes("P");
    };

    // Function to get day of the week from the date string
    const getDayOfWeek = (dateString) => {
        // Match everything inside parentheses (e.g., "(Fri)" in "11/1/2024(Fri)")
        const dayMatch = dateString.match(/\((.*?)\)/);
        return dayMatch ? dayMatch[1] : ""; // Return the day (e.g., "Fri") or empty string if not found
    };

    // Modify the formatDate function to display the date without the day inside parentheses
    const formatDate = (dateString) => {
        const parts = dateString.split("(")[0].split("/"); // Extract date before parentheses
        const dayOfWeek = getDayOfWeek(dateString); // Extract the day of the week from parentheses
        if (parts.length >= 2) {
            return `${parts[1]}/${parts[0]} (${dayOfWeek})`; // Returns "MM/DD (Day)"
        }
        return dateString;
    };

    // Get the past 3 days of attendance
    const getPast3Days = (attendanceDict) => {
        return Object.entries(attendanceDict).slice(0, 3);
    };

    if (loading) {
        return (
            <Card className="w-full max-w-4xl mx-auto mt-8">
                <CardHeader>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Full anomaly data
    const fullAnomalies = Object.entries(attendanceData).filter(([_, attendance]) =>
        checkForAnomalies(attendance)
    );

    // Anomalies from the past 3 days
    const past3DaysAnomalies = getPast3Days(attendanceData).filter(([_, attendance]) =>
        checkForAnomalies(attendance)
    );

    // Decide which data to display: past 3 days or full report
    const dataToDisplay = showFullReport ? fullAnomalies : past3DaysAnomalies;

    return (
        <Card className="w-full max-w-4xl mx-auto mt-8 border-none">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                    <div>
                        <CardTitle>Attendance Anomalies</CardTitle>
                        <CardDescription>
                            Ask your teachers about attendance for which you were marked absent on the days you were present.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {dataToDisplay.length === 0 ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No Anomalies Found</AlertTitle>
                        <AlertDescription>
                            There are no anomalies in the attendance records for this roll number.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="space-y-6">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[80px]">Date</TableHead>
                                    <TableHead>1</TableHead>
                                    <TableHead>2</TableHead>
                                    <TableHead>3</TableHead>
                                    <TableHead>4</TableHead>
                                    <TableHead>5</TableHead>
                                    <TableHead>6</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dataToDisplay.map(([date, attendance]) => (
                                    <TableRow key={date} className="hover:bg-muted/50">
                                        <TableCell className="font-medium">{formatDate(date)}</TableCell>
                                        {attendance.split("").map((status, index) => (
                                            <TableCell key={index} className="px-1">
                                                <Badge
                                                    variant={status === "P" ? "outline" : "secondary"}
                                                    className={
                                                        status === "P"
                                                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                            : "bg-red-100 text-red-800 hover:bg-red-100"
                                                    }
                                                >
                                                    {status}
                                                </Badge>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>

            {/* Button to toggle between past 3 days and full report */}
            <CardContent className="pt-4">
                <Button
                    onClick={() => setShowFullReport(!showFullReport)}
                    variant="outline"
                    className="w-full"
                >
                    {showFullReport ? "Show Last 3 Days" : "Get Full Anomaly Report"}
                </Button>
            </CardContent>
        </Card>
    );
}
