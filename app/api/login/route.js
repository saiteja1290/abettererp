import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

export async function POST(request) {
    const { rollNumber } = await request.json()

    const client = new MongoClient(process.env.MONGODB_URI)

    try {
        await client.connect()
        const db = client.db(process.env.DATABASE_NAME)
        const collection = db.collection('students')

        const student = await collection.findOne({ rollNumber })

        if (student) {
            return NextResponse.json({ message: 'Login successful' }, { status: 200 })
        } else {
            return NextResponse.json({ message: 'Invalid roll number' }, { status: 401 })
        }
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    } finally {
        await client.close()
    }
}