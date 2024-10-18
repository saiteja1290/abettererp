import AttendancePieChart from './attendance-pie-chart'
import AttendanceDetails from './attendance-details'

export default function AttendanceDashboard() {
    return (
        <div className=" ">
            <AttendancePieChart />
            <AttendanceDetails />
        </div>
    )
}