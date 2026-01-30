import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/marketing/feature-card";
import { PricingCard } from "@/components/marketing/pricing-card";
import {
  ArrowRight,
  BarChart3,
  Cloud,
  DollarSign,
  FileSpreadsheet,
  Leaf,
  Receipt,
  Shield,
  Smartphone,
  Tractor,
  Users,
  Warehouse,
} from "lucide-react";

const features = [
  {
    icon: DollarSign,
    title: "Expense Tracking",
    description:
      "Track every farm expense with detailed line items, categories, and receipt scanning. Know exactly where your money goes.",
  },
  {
    icon: BarChart3,
    title: "Income Management",
    description:
      "Record sales, track revenue sources, and monitor cash flow. Get a complete picture of your farm's financial health.",
  },
  {
    icon: Warehouse,
    title: "Inventory Control",
    description:
      "Manage livestock, equipment, supplies, and fields. Keep accurate records of everything on your farm.",
  },
  {
    icon: Receipt,
    title: "Smart Invoicing",
    description:
      "Create professional invoices, track payments, and manage customer accounts. Get paid faster with online payment options.",
  },
  {
    icon: FileSpreadsheet,
    title: "CSV Import/Export",
    description:
      "Import existing data from spreadsheets or export reports for accounting. Seamlessly integrate with your workflow.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Invite family members or employees to help manage the farm. Control access with role-based permissions.",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Create Your Farm",
    description:
      "Sign up for free and set up your farm profile in minutes. Add basic information about your operation.",
  },
  {
    step: "2",
    title: "Track Everything",
    description:
      "Log expenses, record income, manage inventory, and create invoices. Use receipt scanning to save time.",
  },
  {
    step: "3",
    title: "Gain Insights",
    description:
      "View reports and analytics to understand your farm's performance. Make data-driven decisions to increase profits.",
  },
];

const testimonials = [
  {
    quote:
      "HarvesTrackr has completely transformed how we manage our family farm. We finally have visibility into our finances.",
    author: "Sarah M.",
    role: "Dairy Farm Owner",
  },
  {
    quote:
      "The receipt scanning feature alone saves me hours every week. I can't imagine going back to spreadsheets.",
    author: "James R.",
    role: "Crop Farmer",
  },
  {
    quote:
      "Finally, a farm management tool that understands what small farmers actually need. Highly recommended!",
    author: "Maria L.",
    role: "Organic Vegetable Farmer",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for small farms getting started",
    price: "Free",
    features: [
      "1 Farm",
      "Basic expense tracking",
      "Up to 100 transactions/month",
      "Receipt scanning (10/month)",
      "Email support",
    ],
  },
  {
    name: "Professional",
    description: "For growing farms that need more",
    price: "$19",
    highlighted: true,
    features: [
      "Up to 3 Farms",
      "Unlimited transactions",
      "Unlimited receipt scanning",
      "Invoice management",
      "Team members (up to 5)",
      "CSV import/export",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    description: "For large operations with complex needs",
    price: "Custom",
    features: [
      "Unlimited Farms",
      "Everything in Professional",
      "Unlimited team members",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "On-site training",
    ],
    buttonText: "Contact Sales",
  },
];

export function LandingContent() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-50 to-background py-20 dark:from-green-950/20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-green-200 bg-green-100 px-4 py-1.5 text-sm font-medium text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300">
              <Leaf className="mr-2 h-4 w-4" />
              Farm Management Made Simple
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Grow Your Farm with{" "}
              <span className="text-green-600">Confidence</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Track expenses, manage income, control inventory, and invoice
              customers - all in one powerful platform built specifically for
              modern farmers.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required. Free for small farms.
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-10 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute -left-20 top-40 h-72 w-72 rounded-full bg-green-200/30 blur-3xl dark:bg-green-900/20" />
        <div className="absolute -right-20 top-60 h-72 w-72 rounded-full bg-green-300/20 blur-3xl dark:bg-green-800/10" />
      </section>

      {/* Trust Indicators */}
      <section className="border-b bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Bank-Level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Cloud-Based</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Mobile Friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <Tractor className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Built for Farmers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything You Need to Run Your Farm
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features designed specifically for agricultural
              operations of all sizes.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/30 py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Get Started in Minutes
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple setup, powerful results. Here&apos;s how to get your farm
              on track.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {howItWorks.map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Trusted by Farmers Everywhere
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our customers have to say about HarvesTrackr.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-xl border bg-card p-6 shadow-sm"
              >
                <p className="mb-4 text-muted-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-muted/30 py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose the plan that fits your farm. Start free, upgrade when
              you&apos;re ready.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-green-600 to-green-700 px-8 py-16 text-center text-white shadow-xl">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Ready to Transform Your Farm?
            </h2>
            <p className="mb-8 text-lg text-green-100">
              Join thousands of farmers who are already using HarvesTrackr to
              manage their operations more efficiently.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-white text-green-700 hover:bg-green-50"
              >
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
