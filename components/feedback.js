"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader } from "react-feather"; // Import the Loader component

export default function FeedbackForm() {
    const [idea, setIdea] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading spinner
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const storedRollNumber = localStorage.getItem("rollNumber");
        if (!storedRollNumber) {
            router.push("/");
            return;
        }
        setRollNumber(storedRollNumber);
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!idea) {
            setError("Please enter your idea.");
            return;
        }

        setLoading(true); // Start loading

        try {
            // Send the feedback data to the backend
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    rollNumber, // Include the roll number
                    idea // Include the idea
                })
            });

            setLoading(false); // Stop loading

            if (response.ok) {
                setSubmitted(true);
                setError("");

                // Reset idea field after submission
                setIdea("");
            } else {
                setError("Failed to submit feedback.");
            }
        } catch (err) {
            setLoading(false); // Stop loading on error
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <Card className="max-w-lg mx-auto mt-8">
            <CardHeader>
                <CardTitle>Submit Your Ideas for the Project</CardTitle>
            </CardHeader>
            <CardContent>
                {submitted ? (
                    <Alert variant="success" className="mb-4">
                        <AlertTitle>Thank You!</AlertTitle>
                        <AlertDescription>
                            Your idea has been submitted successfully.
                        </AlertDescription>
                    </Alert>
                ) : null}

                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {!submitted && (
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Your Idea</label>
                                <Textarea
                                    name="idea"
                                    value={idea}
                                    onChange={(e) => setIdea(e.target.value)}
                                    placeholder="Describe your idea for the project..."
                                    required
                                    disabled={loading} // Disable textarea while loading
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <Loader className="animate-spin mr-2" size={20} />
                                        Submitting...
                                    </div>
                                ) : (
                                    'Submit Feedback'
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
