import AttendancePieChart from './attendance-pie-chart'
import AttendanceDetails from './attendance-details'

export default function AttendanceDashboard() {
    return (
        <div className="space-y-8 p-8 ">
            <AttendancePieChart />
            <AttendanceDetails />
        </div>
    )
}