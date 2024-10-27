import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const rollNumber = searchParams.get('rollNumber')

    if (!rollNumber) {
        return NextResponse.json({ message: 'Roll number is required' }, { status: 400 })
    }

    const client = new MongoClient(process.env.MONGODB_URI)

    try {
        await client.connect()
        const db = client.db(process.env.DATABASE_NAME)
        const collection = db.collection('students')

        // Find student by roll number
        const student = await collection.findOne({ rollNumber })

        if (student) {
            // Return both attendance percentage and current classes
            return NextResponse.json({
                attendancePercentage: student.attendancePercentage,
                currentclasses: student.currentclasses, // Make sure this field is available
                classesheld: student.classesheld, // Make sure this field is available
                attendancedict: student.attendancedict, // Make sure this field is available
                name: student.name // Make sure this field is available
            }, { status: 200 })
        } else {
            return NextResponse.json({ message: 'Student not found' }, { status: 404 })
        }
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    } finally {
        await client.close()
    }
}
