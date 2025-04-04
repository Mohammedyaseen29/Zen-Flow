import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, ArrowRight, BarChart3, Clock, Users, Workflow, Code, Database } from "lucide-react"
import logo from "@/public/logo.svg"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-white px-4">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src={logo} alt="logo.svg" className="w-6 h-6"/>
            <span className="text-xl font-bold">Zenflow</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-[#266DF0]">
              Home
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-[#266DF0]">
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
        <section className="w-full py-20 md:py-32 lg:py-40 border-b">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Build powerful automation flows with <span className="text-[#266DF0]">no code</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 md:text-xl">
                Zenflow is an intuitive visual builder that lets you create complex automation workflows in minutes, not
                days.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/auth/sign-in">
                  <Button className="bg-[#266DF0] hover:bg-[#1a5cd0] h-12 px-8 text-base">Start building for free</Button>
                </Link>
                <Button variant="outline" className="border-[#266DF0] text-[#266DF0] h-12 px-8 text-base">
                  <Link href="/how-it-works" className="flex items-center gap-2">
                    How it works <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full py-16 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Everything you need to automate your workflow
              </h2>
              <p className="mt-4 text-gray-600">
                Zenflow combines powerful features with an intuitive interface to make automation accessible to
                everyone.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Workflow className="h-8 w-8 text-[#266DF0]" />,
                  title: "Visual Flow Builder",
                  description:
                    "Drag-and-drop interface to create complex workflows without writing a single line of code.",
                },
                {
                  icon: <Code className="h-8 w-8 text-[#266DF0]" />,
                  title: "Custom Logic",
                  description:
                    "Add conditional logic, loops, and transformations to handle complex business processes.",
                },
                {
                  icon: <Database className="h-8 w-8 text-[#266DF0]" />,
                  title: "Data Integration",
                  description: "Connect to any data source with our extensive library of pre-built connectors.",
                },
                {
                  icon: <Clock className="h-8 w-8 text-[#266DF0]" />,
                  title: "Scheduled Triggers",
                  description: "Set workflows to run on schedules, from simple intervals to complex cron expressions.",
                },
                {
                  icon: <BarChart3 className="h-8 w-8 text-[#266DF0]" />,
                  title: "Real-time Analytics",
                  description: "Monitor performance and get insights into your automation with detailed analytics.",
                },
                {
                  icon: <Users className="h-8 w-8 text-[#266DF0]" />,
                  title: "Team Collaboration",
                  description: "Work together with your team to build, test, and deploy automation workflows.",
                },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col p-6 bg-white rounded-lg border shadow-sm hover:scale-105 transition">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Preview */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How Zenflow Works</h2>
              <p className="mt-4 text-gray-600">Create powerful automation workflows in three simple steps.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Design Your Flow",
                  description:
                    "Drag and drop nodes to create your workflow. Connect triggers, actions, and conditions to build your automation logic.",
                },
                {
                  step: "02",
                  title: "Configure & Test",
                  description:
                    "Configure each node with your specific parameters. Test your workflow in real-time to ensure it works as expected.",
                },
                {
                  step: "03",
                  title: "Deploy & Monitor",
                  description:
                    "Deploy your workflow with a single click. Monitor performance and receive alerts if anything goes wrong.",
                },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#266DF0] text-xl font-bold text-white mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button className="bg-[#266DF0] hover:bg-[#1a5cd0]">
                <Link href="/how-it-works">Learn more about how it works</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-16 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Trusted by innovative teams</h2>
              <p className="mt-4 text-gray-600">See what our customers have to say about Zenflow.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote:
                    "Zenflow has transformed how we handle our internal processes. What used to take days now happens automatically.",
                  author: "Sarah Johnson",
                  role: "Operations Manager, TechCorp",
                },
                {
                  quote:
                    "The visual interface makes it easy for non-technical team members to create and modify workflows. Game changer!",
                  author: "Michael Chen",
                  role: "CTO, GrowthStartup",
                },
                {
                  quote: "We've reduced manual data entry by 85% since implementing Zenflow across our organization.",
                  author: "Emily Rodriguez",
                  role: "Project Manager, CreativeAgency",
                },
              ].map((testimonial, i) => (
                <div key={i} className="flex flex-col justify-between p-6 bg-white rounded-lg border shadow-sm">
                  <p className="italic text-gray-600 mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to automate your workflow?</h2>
              <p className="mt-4 text-gray-600">
                Start building powerful automation flows today. No credit card required.
              </p>
              <div className="mt-8">
                <Link href="/auth/sign-in">
                  <Button className="bg-[#266DF0] hover:bg-[#1a5cd0] h-12 px-8 text-base">Get started for free</Button>
                </Link>
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

