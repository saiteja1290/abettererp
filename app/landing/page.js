'use cleint'
import React from 'react';
import { GitHub } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="flex h-screen bg-black text-white">
            {/* Left side - Testimonial */}
            <div className="w-1/2 p-8 flex flex-col justify-between">
                <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-white rounded"></div>
                    <span className="font-bold">Acme Inc</span>
                </div>
                <div>
                    <p className="text-2xl font-light mb-4">
                        "This library has saved me countless hours of work and helped me
                        deliver stunning designs to my clients faster than ever before."
                    </p>
                    <p className="font-medium">Sofia Davis</p>
                </div>
            </div>

            {/* Right side - Sign Up Form */}
            <div className="w-1/2 p-8 flex flex-col justify-between">
                <div className="text-right">
                    <button className="text-sm">Login</button>
                </div>
                <div className="max-w-md mx-auto w-full">
                    <h2 className="text-3xl font-bold mb-2">Create an account</h2>
                    <p className="text-gray-400 mb-6">
                        Enter your email below to create your account
                    </p>
                    <input
                        type="email"
                        placeholder="name@example.com"
                        className="w-full p-3 mb-4 bg-gray-800 rounded"
                    />
                    <button className="w-full p-3 bg-white text-black rounded font-medium mb-4">
                        Sign In with Email
                    </button>
                    <div className="text-center text-sm text-gray-400 mb-4">
                        OR CONTINUE WITH
                    </div>
                    <button className="w-full p-3 bg-gray-800 rounded font-medium flex items-center justify-center">
                        <GitHub className="mr-2" size={20} />
                        GitHub
                    </button>
                    <p className="text-sm text-gray-400 mt-6 text-center">
                        By clicking continue, you agree to our{' '}
                        <a href="#" className="underline">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="underline">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;