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
import { AlertCircle, CheckCircle2, UserCircle } from "lucide-react";

export default function AnomalyDetection() {
    const [attendanceData, setAttendanceData] = useState({});
    const [rollNumber, setRollNumber] = useState("");
    const [loading, setLoading] = useState(true);
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

    const getPast3Days = (attendanceDict) => {
        return Object.entries(attendanceDict).slice(0, 3);
    };

    const checkForAnomalies = (attendanceString) => {
        return attendanceString.includes("A") && attendanceString.includes("P");
    };

    const formatDate = (dateString) => {
        // Assuming dateString is in format "DD/MM/YYYY" or similar
        const parts = dateString.split("/");
        if (parts.length >= 2) {
            return `${parts[0]}/${parts[1]}`; // Returns "DD/MM"
        }
        return dateString;
    };

    const StatusBadge = ({ status }) => {
        if (status === "anomaly") {
            return (
                <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Anomaly
                </Badge>
            );
        }
        return (
            <Badge variant="success" className="gap-1 bg-green-500 hover:bg-green-600">
                <CheckCircle2 className="w-3 h-3" />
                OK
            </Badge>
        );
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

    return (
        <Card className="w-full max-w-4xl mx-auto mt-8 border-none">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                    {/* <UserCircle className="w-8 h-8 text-primary" /> */}
                    <div>
                        <CardTitle>Attendance Anamolies (previous 3 days)</CardTitle>
                        {/* <CardDescription>Roll Number: {rollNumber}</CardDescription> */}
                        <CardDescription>Ask your teachers attendance for which you were marked absent on the present days</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {Object.keys(attendanceData).length === 0 ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No Data Available</AlertTitle>
                        <AlertDescription>
                            No attendance records were found for this roll number.
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
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {getPast3Days(attendanceData).map(([date, attendance]) => (
                                    <TableRow key={date} className="hover:bg-muted/50">
                                        <TableCell className="font-medium">{formatDate(date)}</TableCell>
                                        {attendance.split("").map((status, index) => (
                                            <TableCell key={index} className="px-2">
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
                                        <TableCell>
                                            <StatusBadge
                                                status={checkForAnomalies(attendance) ? "anomaly" : "normal"}
                                            />
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>


                    </div>
                )}
            </CardContent>
        </Card>
    );
}