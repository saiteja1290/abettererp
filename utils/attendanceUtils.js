import { format, parse } from 'date-fns';

// Function to process attendancedict and generate heatmap data
export function processAttendance(attendancedict) {
    const heatmapData = {};

    Object.keys(attendancedict).forEach((dateString) => {
        const record = attendancedict[dateString];
        const date = parse(dateString, 'MM/dd/yyyy(E)', new Date());
        const weekday = format(date, 'EEEE'); // Get the day of the week (e.g., "Mon", "Wed")

        // Count number of 'P's (present)
        const presentCount = record.split('').filter(char => char === 'P').length;

        // Assign score for heatmap (based on the number of P's)
        heatmapData[dateString] = {
            weekday,
            score: presentCount / 6, // Normalize score to be between 0 and 1
        };
    });

    return heatmapData;
}
