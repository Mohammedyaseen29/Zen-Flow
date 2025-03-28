    "use client"
    
    import { Mail } from "lucide-react"
    import { Button } from "@/components/ui/button"
    import { Input } from "@/components/ui/input"
    import Image from "next/image"
    import logo from "@/public/logo.svg";
    import { signIn } from "next-auth/react";
    import { useRef, useState } from "react"

    export default function SignIn() {
        const emailRef = useRef<string>("")
        const [isSubmitting,setSubmitting] = useState(false);

        const handleGoogleSignin = ()=>{
            signIn("google",{callbackUrl:"/workspace"})
        }
    return (
        <main className="min-h-screen flex flex-col items-center bg-gray-50">
        {/* Header with logo */}
        <div className="w-full py-8 flex justify-center">
            <div className="flex items-center gap-2">
            <Image src={logo} alt="logo" />
            <span className="text-xl font-bold">Zenflow</span>
            </div>
        </div>

        {/* Main content */}
        <div className="w-full max-w-6xl px-4 flex-1 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 w-full max-w-5xl flex flex-col md:flex-row overflow-hidden">
            {/* Left side - Login form */}
            <div className="w-full md:w-2/5 p-8 flex flex-col justify-center space-y-6">
                {/* Google sign in button */}
                <button onClick={handleGoogleSignin} className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                </svg>
                <span>Sign in with Google</span>
                </button>

                {/* Divider */}
                <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                </div>

                {/* Email input */}
                <div className="space-y-2">
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                    type="email"
                    placeholder="Enter your work email address"
                    className="pl-10 py-5 border-gray-300"
                    />
                </div>
                </div>

                {/* Continue button */}
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-5">Continue</Button>
            </div>

            {/* Right side - Welcome text */}
            <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                <h1 className="text-2xl font-semibold mb-4">Welcome to Zenflow.</h1>
                <div className="space-y-4 text-gray-600">
                <p>
                    Zenflow is a radically new type of CRM. Built on an entirely new type of data architecture, you'll have
                    profiles and records of every interaction within your network in minutes, always updated in real-time.
                </p>
                <p>
                    You'll be able to customize and create your CRM <span className="italic">exactly</span> as you want it.
                </p>
                <p className="mt-6">Let's begin.</p>
                </div>
            </div>
            </div>
        </div>
        </main>
    )
    }

