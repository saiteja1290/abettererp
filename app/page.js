// File: app/page.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader } from "react-feather" // Icon for the spinner

export default function Home() {
  const [rollNumber, setRollNumber] = useState('')
  const [loading, setLoading] = useState(false) // State to manage loading spinner
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true) // Set loading to true when login starts

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rollNumber }),
    })

    setLoading(false) // Set loading to false after the response is received

    if (response.ok) {
      localStorage.setItem('rollNumber', rollNumber)
      router.push('/dashboard')
    } else {
      alert('Invalid roll number')
    }
  }

  return (
    <main className="flex h-screen bg-black text-white">
      {/* Left partition - Hidden on small screens */}
      <div className="hidden md:flex w-1/2 bg-background items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-300">A Better ERP</h1>
      </div>

      {/* Right partition - Full width on small screens */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <Card className="w-full max-w-[350px] bg-black border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-white">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter Roll Number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="bg-black text-white border-gray-700"
                disabled={loading} // Disable input during loading
              />
              <Button
                type="submit"
                className="w-full bg-white text-black"
                disabled={loading} // Disable button during loading
              >
                {loading ? ( // Show spinner if loading is true
                  <div className="flex items-center justify-center">
                    <Loader className="animate-spin mr-2" size={20} />
                    Logging in...
                  </div>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
