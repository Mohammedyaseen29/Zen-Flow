    import Link from "next/link"
    import { Button } from "@/components/ui/button"
    import {
    Zap,
    ArrowRight,
    ArrowLeft,
    Workflow,
    Code,
    Database,
    Settings,
    Play,
    BarChart3,
    CheckCircle,
    } from "lucide-react"
    import Image from "next/image"
    import logo from "@/public/logo.svg"

    export default function HowItWorksPage() {
    return (
        <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 w-full border-b bg-white px-4">
            <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                <Image src={logo} alt="logo.svg" className="w-6 h-6"/>
                <span className="text-xl font-bold">Zenflow</span>
                </Link>
            </div>
            <nav className="hidden md:flex gap-6">
                <Link href="/" className="text-sm font-medium text-gray-600 hover:text-[#266DF0]">
                Home
                </Link>
                <Link href="/how-it-works" className="text-sm font-medium text-[#266DF0]">
                How It Works
                </Link>
                <Link href="/examples" className="text-sm font-medium text-gray-600 hover:text-[#266DF0]">
                Examples
                </Link>
            </nav>
            <div className="flex items-center gap-4">
                <Link href="/auth/sign-in">
                    <Button className="bg-[#266DF0] hover:bg-[#1a5cd0]">Get Started</Button>
                </Link>
            </div>
            </div>
        </header>
        <main className="flex-1">
            {/* Hero Section */}
            <section className="w-full py-16 md:py-24 border-b">
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center">
                <Link href="/" className="inline-flex items-center text-sm text-[#266DF0] mb-4 hover:underline">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back to home
                </Link>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">How Zenflow Works</h1>
                <p className="mt-6 text-lg text-gray-600">
                    A detailed look at how Zenflow helps you build powerful automation workflows without code.
                </p>
                </div>
            </div>
            </section>

            {/* Step 1: Design Your Flow */}
            <section className="w-full py-16 md:py-24 px-4">
            <div className="container px-4 md:px-6">
                <div className="grid gap-12 md:grid-cols-2 items-center">
                <div>
                    <div className="inline-flex items-center justify-center rounded-full bg-[#266DF0]/10 px-3 py-1 text-sm font-medium text-[#266DF0] mb-4">
                    Step 1
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter mb-4">Design Your Flow</h2>
                    <div className="space-y-4 text-gray-600">
                    <p>
                        Zenflow's intuitive visual interface makes it easy to design complex automation workflows without
                        writing code. Start by selecting a trigger that will initiate your workflow.
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 text-[#266DF0] mt-0.5 shrink-0" />
                        <span>Drag and drop nodes from our extensive library</span>
                        </li>
                        <li className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 text-[#266DF0] mt-0.5 shrink-0" />
                        <span>Connect nodes with simple point-and-click</span>
                        </li>
                        <li className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 text-[#266DF0] mt-0.5 shrink-0" />
                        <span>Choose from event-based, scheduled, or manual triggers</span>
                        </li>
                        <li className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 text-[#266DF0] mt-0.5 shrink-0" />
                        <span>Add conditional logic and branching paths</span>
                        </li>
                    </ul>
                    </div>
                    <div className="mt-8">
                    <div className="p-4 bg-gray-50 border rounded-lg">
                        <h3 className="font-medium mb-2">Available Node Types:</h3>
                        <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center p-2 bg-white rounded border">
                            <Workflow className="h-4 w-4 text-[#266DF0] mr-2" />
                            <span className="text-sm">Triggers</span>
                        </div>
                        <div className="flex items-center p-2 bg-white rounded border">
                            <Code className="h-4 w-4 text-[#266DF0] mr-2" />
                            <span className="text-sm">Actions</span>
                        </div>
                        <div className="flex items-center p-2 bg-white rounded border">
                            <Database className="h-4 w-4 text-[#266DF0] mr-2" />
                            <span className="text-sm">Data Operations</span>
                        </div>
                        <div className="flex items-center p-2 bg-white rounded border">
                            <Settings className="h-4 w-4 text-[#266DF0] mr-2" />
                            <span className="text-sm">Logic Controls</span>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="bg-gray-100 border rounded-lg p-8 h-[400px] flex items-center justify-center">
                    <div className="text-center">
                    <Workflow className="h-16 w-16 text-[#266DF0] mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Visual Flow Builder</h3>
                    <p className="text-gray-600 max-w-xs mx-auto">
                        Drag-and-drop interface for creating complex workflows with ease
                    </p>
                    </div>
                </div>
                </div>
            </div>
            </section>

            {/* Step 2: Configure & Test */}
            <section className="w-full py-16 md:py-24 bg-gray-50">
            <div className="container px-4 md:px-6">
                <div className="grid gap-12 md:grid-cols-2 items-center">
                <div className="bg-white border rounded-lg p-8 h-[400px] flex items-center justify-center order-last md:order-first">
                    <div className="text-center">
                    <Play className="h-16 w-16 text-[#266DF0] mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Real-time Testing</h3>
                    <p className="text-gray-600 max-w-xs mx-auto">
                        Test your workflows in real-time before deploying to production
                    </p>
                    </div>
                </div>
                <div>
                    <div className="inline-flex items-center justify-center rounded-full bg-[#266DF0]/10 px-3 py-1 text-sm font-medium text-[#266DF0] mb-4">
                    Step 2
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter mb-4">Configure & Test</h2>
                    <div className="space-y-4 text-gray-600">
                    <p>
                        Once you've designed your flow, it's time to configure each node with your specific parameters and
                        test your workflow to ensure it works as expected.
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 text-[#266DF0] mt-0.5 shrink-0" />
                        <span>Configure each node with your specific parameters</span>
                        </li>
                        <li className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 text-[#266DF0] mt-0.5 shrink-0" />
                        <span>Map data between nodes with our visual data mapper</span>
                        </li>
                        <li className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 text-[#266DF0] mt-0.5 shrink-0" />
                        <span>Test your workflow in real-time with sample data</span>
                        </li>
                        <li className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 text-[#266DF0] mt-0.5 shrink-0" />
                        <span>Debug issues with our step-by-step execution viewer</span>
                        </li>
                    </ul>
                    </div>
                    <div className="mt-8">
                    <div className="p-4 bg-white border rounded-lg">
                        <h3 className="font-medium mb-2">Testing Features:</h3>
                        <div className="space-y-2">
                        <div className="p-2 bg-gray-50 rounded border">
                            <span className="text-sm font-medium">Step-by-step execution</span>
                            <p className="text-xs text-gray-600 mt-1">See exactly how data flows through your workflow</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded border">
                            <span className="text-sm font-medium">Sample data generation</span>
                            <p className="text-xs text-gray-600 mt-1">
                            Automatically generate test data based on your schema
                            </p>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </section>

            {/* Step 3: Deploy & Monitor */}
            <section className="w-full py-16 md:py-24 px-4">
            <div className="container px-4 md:px-6">
                <div className="grid gap-12 md:grid-cols-2 items-center">
                <div>
                    <div className="inline-flex items-center justify-center rounded-full bg-[#266DF0]/10 px-3 py-1 text-sm font-medium text-[#266DF0] mb-4">
                    Step 3
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter mb-4">Deploy & Monitor</h2>
                    <div className="space-y-4 text-gray-600">
                    <p>
                        Once you're satisfied with your workflow, deploy it with a single click and monitor its performance
                        in real-time.
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 text-[#266DF0] mt-0.5 shrink-0" />
                        <span>Deploy to production with a single click</span>
                        </li>
                        <li className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 text-[#266DF0] mt-0.5 shrink-0" />
                        <span>Monitor performance with real-time analytics</span>
                        </li>
                        <li className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 text-[#266DF0] mt-0.5 shrink-0" />
                        <span>Set up alerts for critical failures</span>
                        </li>
                        <li className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 text-[#266DF0] mt-0.5 shrink-0" />
                        <span>View detailed execution logs for troubleshooting</span>
                        </li>
                    </ul>
                    </div>
                    <div className="mt-8">
                    <div className="p-4 bg-gray-50 border rounded-lg">
                        <h3 className="font-medium mb-2">Monitoring Dashboard:</h3>
                        <div className="space-y-2">
                        <div className="flex justify-between p-2 bg-white rounded border">
                            <span className="text-sm">Total Executions</span>
                            <span className="text-sm font-medium">1,234</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white rounded border">
                            <span className="text-sm">Success Rate</span>
                            <span className="text-sm font-medium text-green-600">99.8%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white rounded border">
                            <span className="text-sm">Avg. Execution Time</span>
                            <span className="text-sm font-medium">1.2s</span>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="bg-gray-100 border rounded-lg p-8 h-[400px] flex items-center justify-center">
                    <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-[#266DF0] mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Performance Analytics</h3>
                    <p className="text-gray-600 max-w-xs mx-auto">
                        Monitor your workflows with detailed analytics and insights
                    </p>
                    </div>
                </div>
                </div>
            </div>
            </section>

            {/* Examples Section */}
            <section className="w-full py-16 md:py-24 bg-gray-50">
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Common Automation Examples</h2>
                <p className="mt-4 text-gray-600">Explore some common use cases for Zenflow automation.</p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                    {
                    title: "Customer Onboarding",
                    description:
                        "Automate your customer onboarding process from signup to welcome email and account setup.",
                    },
                    {
                    title: "Data Synchronization",
                    description: "Keep your data in sync across multiple systems automatically.",
                    },
                    {
                    title: "Approval Workflows",
                    description: "Create multi-step approval processes with notifications and reminders.",
                    },
                ].map((example, i) => (
                    <div key={i} className="flex flex-col p-6 bg-white rounded-lg border shadow-sm">
                    <h3 className="text-xl font-bold mb-2">{example.title}</h3>
                    <p className="text-gray-600 mb-4">{example.description}</p>
                    <Link href="/examples" className="text-[#266DF0] hover:underline mt-auto inline-flex items-center">
                        View example <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                    </div>
                ))}
                </div>
            </div>
            </section>

            {/* CTA Section */}
            <section className="w-full py-16 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to start automating?</h2>
                <p className="mt-4 text-gray-600">
                    Create your first workflow in minutes with our intuitive visual builder.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <Button className="bg-[#266DF0] hover:bg-[#1a5cd0] h-12 px-8 text-base">Start building for free</Button>
                    <Button variant="outline" className="border-[#266DF0] text-[#266DF0] h-12 px-8 text-base">
                    <Link href="/examples" className="flex items-center gap-2">
                        View examples <ArrowRight className="h-4 w-4" />
                    </Link>
                    </Button>
                </div>
                </div>
            </div>
            </section>
        </main>
        <footer className="w-full border-t bg-white py-8">
            <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                <div>
                <div className="flex items-center gap-2 mb-4">
                    <Image src={logo} alt="logo.svg" className="w-6 h-6"/>
                    <span className="text-xl font-bold">Zenflow</span>
                </div>
                <p className="text-sm text-gray-600">The visual automation platform for modern teams.</p>
                </div>
                <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                    <li>
                    <Link href="#" className="text-sm text-gray-600 hover:text-[#266DF0]">
                        Features
                    </Link>
                    </li>
                    <li>
                    <Link href="/how-it-works" className="text-sm text-gray-600 hover:text-[#266DF0]">
                        How it works
                    </Link>
                    </li>
                    <li>
                    <Link href="/examples" className="text-sm text-gray-600 hover:text-[#266DF0]">
                        Examples
                    </Link>
                    </li>
                </ul>
                </div>
                <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                    <li>
                    <Link href="#" className="text-sm text-gray-600 hover:text-[#266DF0]">
                        Documentation
                    </Link>
                    </li>
                    <li>
                    <Link href="#" className="text-sm text-gray-600 hover:text-[#266DF0]">
                        Blog
                    </Link>
                    </li>
                    <li>
                    <Link href="#" className="text-sm text-gray-600 hover:text-[#266DF0]">
                        Community
                    </Link>
                    </li>
                </ul>
                </div>
                <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                    <li>
                    <Link href="#" className="text-sm text-gray-600 hover:text-[#266DF0]">
                        About
                    </Link>
                    </li>
                    <li>
                    <Link href="#" className="text-sm text-gray-600 hover:text-[#266DF0]">
                        Contact
                    </Link>
                    </li>
                    <li>
                    <Link href="#" className="text-sm text-gray-600 hover:text-[#266DF0]">
                        Careers
                    </Link>
                    </li>
                </ul>
                </div>
            </div>
            <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-xs text-gray-500">© {new Date().getFullYear()} Zenflow. All rights reserved.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                <Link href="#" className="text-xs text-gray-500 hover:text-[#266DF0]">
                    Terms
                </Link>
                <Link href="#" className="text-xs text-gray-500 hover:text-[#266DF0]">
                    Privacy
                </Link>
                <Link href="#" className="text-xs text-gray-500 hover:text-[#266DF0]">
                    Cookies
                </Link>
                </div>
            </div>
            </div>
        </footer>
        </div>
    )
    }

