import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')

    if (!section) {
        return NextResponse.json({ message: 'Section is required' }, { status: 400 })
    }

    const client = new MongoClient(process.env.MONGODB_URI)

    try {
        await client.connect()
        const db = client.db(process.env.DATABASE_NAME)
        const collection = db.collection('leaderboard')

        // Find the leaderboard data for the requested section
        const sectionData = await collection.findOne({ section })

        if (!sectionData) {
            return NextResponse.json({ message: 'Section not found' }, { status: 404 })
        }

        // Return the section's attendance data (e.g., CSM, CSE 5, etc.)
        return NextResponse.json({
            collection: sectionData // Send the entire section object
        }, { status: 200 })

    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    } finally {
        await client.close()
    }
}
