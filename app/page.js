// File: app/page.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader } from "react-feather"
// import { Checkbox } from "@/components/ui/checkbox"
import { Checkbox } from '@/components/ui/checkbox'

export default function Home() {
  const [rollNumber, setRollNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [isChecked, setIsChecked] = useState(false) // State for checkbox
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rollNumber }),
    })

    setLoading(false)

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
              {/* Roll Number Input */}
              <Input
                type="text"
                placeholder="Enter Roll Number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="bg-black text-white border-gray-700"
                disabled={loading}
              />

              {/* Terms and Conditions Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={isChecked}
                  onCheckedChange={(checked) => setIsChecked(checked)} // Update checkbox state
                  disabled={loading}
                />
                <label htmlFor="terms" className="text-white">
                  I agree to the <span className="underline cursor-pointer"><a href='https://docs.google.com/document/d/12g0qA5vOLIRhSHYaAKJg-gi6F18hcufOnxQgw4WHbzg/edit?addon_store&tab=t.0'>terms and conditions</a> </span>.
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-white text-black"
                disabled={!isChecked || loading} // Disable if terms are not accepted or loading
              >
                {loading ? (
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
