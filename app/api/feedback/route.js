import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// MongoDB client initialization
const client = new MongoClient(process.env.MONGODB_URI);

// API Route for handling POST request to store feedback
export async function POST(request) {
    const { rollNumber, idea } = await request.json();

    // Basic validation
    if (!rollNumber || !idea) {
        return NextResponse.json(
            { message: "Roll number and idea are required" },
            { status: 400 }
        );
    }

    try {
        await client.connect();
        const db = client.db(process.env.DATABASE_NAME);
        const collection = db.collection("feedback");

        // Insert the feedback into the "feedback" collection
        const result = await collection.insertOne({
            rollNumber,
            idea,
            submittedAt: new Date() // Add timestamp
        });

        return NextResponse.json(
            { message: "Feedback submitted successfully", result },
            { status: 201 }
        );
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    } finally {
        await client.close();
    }
}
