"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AttendanceDetails(attendanceData2) {
    const [attendanceData, setAttendanceData] = useState({
        currentClasses: 0,
        classesHeld: 0,
        bunkableClasses: 0,
        bunkableClasses_66: 0, // Add bunkableClasses_66 state
        attendancepercentage: 0,
        name: "",
    });
    const [userattendance, setUserAttendance] = useState(0);
    const [rollNumber, setRollNumber] = useState("");
    const router = useRouter();

    useEffect(() => {
        const storedRollNumber = localStorage.getItem("rollNumber");
        if (!storedRollNumber) {
            router.push("/");
            return;
        }
        setRollNumber(storedRollNumber);

        fetch(`/api/attendance?rollNumber=${storedRollNumber}`)
            .then((res) => res.json())
            .then((data) => {
                const bunkable = calculateBunkableClasses(data.attendancePercentage, data.currentclasses, data.classesheld);
                const bunkable66 = calculateBunkableClasses_66(data.attendancePercentage, data.currentclasses, data.classesheld);

                setAttendanceData({
                    currentClasses: data.currentclasses,
                    classesHeld: data.classesheld,
                    bunkableClasses: bunkable,
                    bunkableClasses_66: bunkable66, // Set the calculated value for bunkableClasses_66
                    name: data.name,
                });
            })
            .catch((error) => {
                console.error("Error fetching attendance:", error);
            });
    }, [router]);

    const calculateBunkableClasses = (attendancePercentage, currentClasses, classesHeld) => {
        setUserAttendance(attendancePercentage);
        if (attendancePercentage < 75) {
            return 4.16 * (0.76 * parseInt(classesHeld) - currentClasses);
        } else if (attendancePercentage === 75) {
            return 0;
        } else {
            return 1.31 * (currentClasses - 0.76 * parseInt(classesHeld));
        }
    };

    const calculateBunkableClasses_66 = (attendancePercentage, currentClasses, classesHeld) => {
        if (attendancePercentage < 66) {
            return 4.16 * (0.66 * parseInt(classesHeld) - currentClasses);
        } else if (attendancePercentage === 66) {
            return 0;
        } else {
            return 1.31 * (currentClasses - 0.66 * parseInt(classesHeld));
        }
    };

    return (
        <Card className="h-full border-background">
            <CardHeader>
                <CardTitle>Bunkable Classes (BETA)</CardTitle>
                <CardDescription>Roll Number: {rollNumber}</CardDescription>
                <CardDescription>Name: {attendanceData.name.slice(8, -17)}</CardDescription>
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
                                {userattendance >= 76
                                    ? "Classes You Can Skip for 76%"
                                    : "Classes to Attend for 76%"}
                            </TableCell>
                            <TableCell className="text-right">
                                {Math.abs(attendanceData.bunkableClasses).toFixed(0)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                {userattendance >= 66
                                    ? "Classes You Can Skip for 66%"
                                    : "Classes to Attend for 66%"}
                            </TableCell>
                            <TableCell className="text-right">
                                {Math.abs(attendanceData.bunkableClasses_66).toFixed(0)} {/* Display bunkableClasses_66 */}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
