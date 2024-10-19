import React, { useState, useEffect } from 'react';
import { processAttendance } from '@/utils/attendanceUtils';
import CalendarHeatmap from 'react-calendar-heatmap';
// import 'react-calendar-heatmap/dist/styles.css';

export default function AttendanceHeatmap({ rollNumber }) {
    const [attendanceData, setAttendanceData] = useState(null);

    useEffect(() => {
        // Fetch attendance data from API
        fetch(`/api/attendance?rollNumber=${rollNumber}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.attendancedict) {
                    const heatmapData = processAttendance(data.attendancedict);
                    setAttendanceData(heatmapData);
                }
            })
            .catch((error) => {
                console.error('Error fetching attendance data:', error);
            });
    }, [rollNumber]);

    if (!attendanceData) {
        return <div>Loading Heatmap</div>;
    }

    // Prepare data for the CalendarHeatmap
    const heatmapValues = Object.keys(attendanceData).map((date) => ({
        date: date, // The date string
        count: attendanceData[date].score * 6, // Convert the score to a scale of 6 (max 'P's)
    }));

    return (
        <div className="heatmap-container">
            <h3 className="text-xl font-bold mb-4 text-center">Attendance Heatmap</h3>
            <CalendarHeatmap
                startDate={new Date('2024-07-29')}
                endDate={new Date('2024-12-31')}
                values={heatmapValues}
                classForValue={(value) => {
                    if (!value) return 'color-empty';
                    // Scale colors from light to dark green based on attendance
                    return `color-scale-${Math.min(Math.floor(value.count), 4)}`;
                }}
                showWeekdayLabels={true}
                tooltipDataAttrs={(value) => {
                    return {
                        'data-tip': value.date ? `Date: ${value.date}, Count: ${value.count}` : 'No data',
                    };
                }}
            />
        </div>

    );
}
