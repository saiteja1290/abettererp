"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AttendanceDetails from '@/components/attendance-details';
import AttendancePieChart from '@/components/attendance-pie-chart';
import AttendanceHeatmap from '@/components/attendance-heatmap';

export default function Dashboard() {
    const [attendanceData, setAttendanceData] = useState({
        attendancePercentage: 0,
        currentClasses: 0,
        classesHeld: 0,
        rollNumber: '',
        bunkableClasses: 0,
    });
    const router = useRouter();

    useEffect(() => {
        const storedRollNumber = localStorage.getItem('rollNumber');
        if (!storedRollNumber) {
            router.push('/');
            return;
        }

        fetch(`/api/attendance?rollNumber=${storedRollNumber}`)
            .then(res => res.json())
            .then(data => {
                const bunkable = calculateBunkableClasses(data.attendancePercentage, data.currentclasses, data.classesheld);
                setAttendanceData({
                    ...data,
                    rollNumber: storedRollNumber,
                    bunkableClasses: bunkable,
                });
            })
            .catch(error => {
                console.error('Error fetching attendance:', error);
            });
    }, [router]);

    const calculateBunkableClasses = (attendancePercentage, currentClasses, classesHeld) => {
        if (attendancePercentage < 75) {
            return 4.16 * ((0.76 * parseInt(classesHeld)) - currentClasses);
        } else if (attendancePercentage === 75) {
            return 0;
        } else {
            return -4.16 * ((0.76 * parseInt(classesHeld)) - currentClasses);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('rollNumber');
        router.push('/');
    };

    return (
        <div className="container mx-auto py-10 px-4 md:px-0">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Section: Attendance Details */}
                <div className="w-full md:w-1/2 order-2 md:order-1 p-4 rounded-lg">
                    <AttendanceDetails
                        attendanceData={attendanceData}
                        handleLogout={handleLogout}
                    />
                </div>

                {/* Right Section: Pie Chart */}
                <div className="w-full md:w-1/2 order-1 md:order-2 p-4  rounded-lg">
                    <AttendancePieChart
                        attendance={attendanceData.attendancePercentage}
                        rollNumber={attendanceData.rollNumber}
                    />
                </div>
            </div>

            {/* Full Width Section: Attendance Heatmap */}
            <div className="w-full mt-8 p-4 shadow rounded-lg">
                <AttendanceHeatmap
                    rollNumber={attendanceData.rollNumber}
                />
            </div>
        </div>
    );
}
