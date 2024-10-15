'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginForm() {
    const [rollNumber, setRollNumber] = useState('')
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rollNumber }),
        })

        if (response.ok) {
            localStorage.setItem('rollNumber', rollNumber)
            router.push('/dashboard')
        } else {
            alert('Invalid roll number')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                type="text"
                placeholder="Enter Roll Number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="bg-gray-800 text-white"
            />
            <Button type="submit" className="w-full">Login</Button>
        </form>
    )
}