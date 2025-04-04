    import Link from "next/link"
    import { Button } from "@/components/ui/button"
    import logo from "@/public/logo.svg"
    import { Zap, ArrowLeft, CheckCircle, Users, Database, FileText, Mail, Calendar, AlertCircle } from "lucide-react"
    import Image from "next/image"

    export default function ExamplesPage() {
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
                <Link href="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-[#266DF0]">
                How It Works
                </Link>
                <Link href="/examples" className="text-sm font-medium text-[#266DF0]">
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
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Automation Examples</h1>
                <p className="mt-6 text-lg text-gray-600">
                    Explore real-world examples of how Zenflow can automate your workflows.
                </p>
                </div>
            </div>
            </section>

            {/* Examples Categories */}
            <section className="w-full py-16 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                    {
                    icon: <Users className="h-8 w-8 text-[#266DF0]" />,
                    title: "HR & Onboarding",
                    description: "Streamline employee onboarding, time-off requests, and HR processes.",
                    examples: ["New employee onboarding", "Time-off request approvals", "Performance review automation"],
                    },
                    {
                    icon: <Database className="h-8 w-8 text-[#266DF0]" />,
                    title: "Data Management",
                    description: "Keep your data synchronized across multiple systems automatically.",
                    examples: [
                        "CRM to marketing automation sync",
                        "Database backup scheduling",
                        "Cross-platform data validation",
                    ],
                    },
                    {
                    icon: <FileText className="h-8 w-8 text-[#266DF0]" />,
                    title: "Document Processing",
                    description: "Automate document creation, approval, and storage workflows.",
                    examples: [
                        "Contract generation and approval",
                        "Document classification",
                        "Automated report generation",
                    ],
                    },
                    {
                    icon: <Mail className="h-8 w-8 text-[#266DF0]" />,
                    title: "Customer Communication",
                    description: "Create personalized, automated customer communication flows.",
                    examples: ["Welcome email sequences", "Support ticket routing", "Customer feedback collection"],
                    },
                    {
                    icon: <Calendar className="h-8 w-8 text-[#266DF0]" />,
                    title: "Scheduling & Reminders",
                    description: "Automate scheduling tasks and send timely reminders.",
                    examples: [
                        "Meeting scheduling and reminders",
                        "Project deadline notifications",
                        "Recurring task management",
                    ],
                    },
                    {
                    icon: <AlertCircle className="h-8 w-8 text-[#266DF0]" />,
                    title: "Alerts & Monitoring",
                    description: "Set up automated alerts and monitoring for critical systems.",
                    examples: ["System health monitoring", "Threshold-based alerts", "Error logging and notification"],
                    },
                ].map((category, i) => (
                    <div key={i} className="flex flex-col p-6 bg-white rounded-lg border shadow-sm">
                    <div className="mb-4">{category.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <ul className="space-y-2 mb-6">
                        {category.examples.map((example, j) => (
                        <li key={j} className="flex items-start">
                            <CheckCircle className="mr-2 h-4 w-4 text-[#266DF0] mt-0.5 shrink-0" />
                            <span className="text-sm">{example}</span>
                        </li>
                        ))}
                    </ul>
                    <Button variant="outline" className="mt-auto border-[#266DF0] text-[#266DF0]">
                        View templates
                    </Button>
                    </div>
                ))}
                </div>
            </div>
            </section>

            {/* Featured Example */}
            <section className="w-full py-16 md:py-24 bg-gray-50">
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Featured Example: Customer Onboarding</h2>
                <p className="mt-4 text-gray-600">
                    See how Zenflow can automate your customer onboarding process from start to finish.
                </p>
                </div>
                <div className="bg-white p-8 rounded-lg border shadow-sm">
                <div className="space-y-8">
                    <div className="space-y-2">
                    <h3 className="text-xl font-bold">The Challenge</h3>
                    <p className="text-gray-600">
                        Manual customer onboarding is time-consuming and error-prone, leading to delays and poor first
                        impressions.
                    </p>
                    </div>
                    <div className="space-y-2">
                    <h3 className="text-xl font-bold">The Solution</h3>
                    <p className="text-gray-600">
                        An automated workflow that handles each step of the onboarding process, from welcome emails to
                        account setup and follow-ups.
                    </p>
                    </div>
                    <div className="space-y-4">
                    <h3 className="text-xl font-bold">The Workflow</h3>
                    <ol className="space-y-4">
                        <li className="flex">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#266DF0] text-white font-bold text-sm mr-3">
                            1
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border flex-grow">
                            <h4 className="font-medium">Trigger: New Customer Signup</h4>
                            <p className="text-sm text-gray-600 mt-1">
                            Workflow begins when a new customer signs up through your website or CRM.
                            </p>
                        </div>
                        </li>
                        <li className="flex">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#266DF0] text-white font-bold text-sm mr-3">
                            2
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border flex-grow">
                            <h4 className="font-medium">Action: Send Welcome Email</h4>
                            <p className="text-sm text-gray-600 mt-1">
                            Automatically send a personalized welcome email with account details and next steps.
                            </p>
                        </div>
                        </li>
                        <li className="flex">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#266DF0] text-white font-bold text-sm mr-3">
                            3
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border flex-grow">
                            <h4 className="font-medium">Action: Create Account</h4>
                            <p className="text-sm text-gray-600 mt-1">
                            Provision the customer's account in your system with default settings.
                            </p>
                        </div>
                        </li>
                        <li className="flex">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#266DF0] text-white font-bold text-sm mr-3">
                            4
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border flex-grow">
                            <h4 className="font-medium">Condition: Check First Login</h4>
                            <p className="text-sm text-gray-600 mt-1">
                            Wait for the customer to log in for the first time, with a 3-day timeout.
                            </p>
                        </div>
                        </li>
                        <li className="flex">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#266DF0] text-white font-bold text-sm mr-3">
                            5
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border flex-grow">
                            <h4 className="font-medium">Action: Follow-up Sequence</h4>
                            <p className="text-sm text-gray-600 mt-1">
                            Send follow-up emails or notifications based on the customer's actions.
                            </p>
                        </div>
                        </li>
                    </ol>
                    </div>
                    <div className="space-y-2">
                    <h3 className="text-xl font-bold">The Results</h3>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 text-[#266DF0] mt-0.5 shrink-0" />
                        <span>80% reduction in onboarding time</span>
                        </li>
                        <li className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 text-[#266DF0] mt-0.5 shrink-0" />
                        <span>95% customer satisfaction with the onboarding process</span>
                        </li>
                        <li className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 text-[#266DF0] mt-0.5 shrink-0" />
                        <span>Zero manual errors in account setup</span>
                        </li>
                    </ul>
                    </div>
                    <div className="pt-4 border-t">
                    <Button className="bg-[#266DF0] hover:bg-[#1a5cd0]">Use this template</Button>
                    </div>
                </div>
                </div>
            </div>
            </section>

            {/* CTA Section */}
            <section className="w-full py-16 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to build your own automation?</h2>
                <p className="mt-4 text-gray-600">
                    Start with one of our templates or build your own custom workflow from scratch.
                </p>
                <div className="mt-8">
                    <Button className="bg-[#266DF0] hover:bg-[#1a5cd0] h-12 px-8 text-base">Get started for free</Button>
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
                    <Link href="/features" className="text-sm text-gray-600 hover:text-[#266DF0]">
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
                    <Link href="/docs" className="text-sm text-gray-600 hover:text-[#266DF0]">
                        Documentation
                    </Link>
                    </li>
                    <li>
                    <Link href="/blog" className="text-sm text-gray-600 hover:text-[#266DF0]">
                        Blog
                    </Link>
                    </li>
                    <li>
                    <Link href="/community" className="text-sm text-gray-600 hover:text-[#266DF0]">
                        Community
                    </Link>
                    </li>
                </ul>
                </div>
                <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                    <li>
                    <Link href="/about" className="text-sm text-gray-600 hover:text-[#266DF0]">
                        About
                    </Link>
                    </li>
                    <li>
                    <Link href="/contact" className="text-sm text-gray-600 hover:text-[#266DF0]">
                        Contact
                    </Link>
                    </li>
                    <li>
                    <Link href="/careers" className="text-sm text-gray-600 hover:text-[#266DF0]">
                        Careers
                    </Link>
                    </li>
                </ul>
                </div>
            </div>
            <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-xs text-gray-500">© {new Date().getFullYear()} Zenflow. All rights reserved.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                <Link href="/terms" className="text-xs text-gray-500 hover:text-[#266DF0]">
                    Terms
                </Link>
                <Link href="/privacy" className="text-xs text-gray-500 hover:text-[#266DF0]">
                    Privacy
                </Link>
                <Link href="/cookies" className="text-xs text-gray-500 hover:text-[#266DF0]">
                    Cookies
                </Link>
                </div>
            </div>
            </div>
        </footer>
        </div>
    )
    }

