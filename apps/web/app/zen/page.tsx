    "use client"

    import { useState, useRef, useEffect } from "react"
    import { useChat } from "ai/react"
    import { Button } from "@/components/ui/button"
    import { Input } from "@/components/ui/input"
    import { Send } from "lucide-react"
    import Image from "next/image"
    import logo from "@/public/logo.svg"
    import Link from "next/link"


    export default function ChatPage() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: "/api/chat",
        initialMessages: [
        {
            id: "welcome-message",
            role: "assistant",
            content: "👋 Hi there! I'm Zen, your automation assistant. How can I help you create workflows today?",
        },
        ],
    })

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    if (!isMounted) {
        return null
    }

    return (
        <div className="flex flex-col h-screen bg-white">
        {/* Header */}
        <Link href="/workspace">
            <header className="flex items-center px-6 py-4 border-b">
                    <Image src={logo} alt="logo.svg" className="w-8 h-8"/>
                    <h1 className="ml-2 text-xl font-bold text-gray-800 cursor-pointer">ZenFlow</h1>
            </header>
        </Link>

        {/* Chat Container */}
        <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user" ? "bg-[#266DF0] text-white" : "bg-gray-100 text-gray-800"
                    }`}
                >
                    {message.content}
                </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
            </div>
        </div>

        {/* Input Form */}
        <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center space-x-2">
            <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask Zen about automation workflows..."
                className="flex-1 border-gray-300 focus:border-[#266DF0] focus:ring-[#266DF0]"
                disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="bg-[#266DF0] hover:bg-[#1b5cd0]">
                <Send className="h-4 w-4" />
            </Button>
            </form>
        </div>
        </div>
    )
    }
