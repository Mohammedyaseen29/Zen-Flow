    import { streamText } from "ai"
    import { google } from "@ai-sdk/google"
    import { createGoogleGenerativeAI } from "@ai-sdk/google"

    // Allow streaming responses up to 30 seconds
    export const maxDuration = 30
    const googleAI = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
    })

    export async function POST(req: Request) {
    const { messages } = await req.json()

    // System prompt to instruct Zen's behavior
    const systemPrompt =
        "You are Zen, an AI assistant for Zen Flow, an automation platform similar to Zapier. " +
        "Your role is to help users create workflows and automations by providing ideas, suggestions, and guidance. " +
        "Always respond when addressed by your name 'Zen'. " +
        "Be helpful, friendly, and knowledgeable about automation concepts, API integrations, and workflow creation. " +
        "Provide specific examples when possible to help users understand how to connect different services and automate tasks."

    try {
        // Use the AI SDK's streamText function with the Google provider
        const response = streamText({
        model: googleAI("gemini-1.5-flash"),
        messages,
        system: systemPrompt,
        })

        // Return the streaming response
        return response.toDataStreamResponse();
    } catch (error) {
        console.error("Error generating response:", error)
        return new Response(JSON.stringify({ error: "Failed to generate response" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
        })
    }
    }
