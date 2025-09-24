"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Link, Globe, QrCode, Check, Star } from "lucide-react"

interface PricingConfig {
    links: number
    domains: number
    qrCodes: number
}

interface PredefinedPlan {
    id: string
    name: string
    description: string
    popular?: boolean
    config: PricingConfig
    originalPrice?: number
    savings?: string
}

const PRICING = {
    links: 0.01, // $0.01 per link
    domains: 5.0, // $5.00 per domain
    qrCodes: 0.05, // $0.05 per QR code
}

const STEP_SIZES = {
    links: [100, 500, 1000, 5000],
    domains: [1, 3, 5, 10],
    qrCodes: [50, 100, 500, 1000],
}

const PREDEFINED_PLANS: PredefinedPlan[] = [
    {
        id: "starter",
        name: "Starter",
        description: "Perfect for personal projects and small businesses",
        config: {
            links: 500,
            domains: 1,
            qrCodes: 50,
        },
        originalPrice: 12.5,
        savings: "20%",
    },
    {
        id: "professional",
        name: "Professional",
        description: "Ideal for growing businesses and marketing teams",
        popular: true,
        config: {
            links: 2000,
            domains: 3,
            qrCodes: 200,
        },
        originalPrice: 45,
        savings: "30%",
    },
    {
        id: "enterprise",
        name: "Enterprise",
        description: "For large organizations with high-volume needs",
        config: {
            links: 10000,
            domains: 10,
            qrCodes: 1000,
        },
        originalPrice: 200,
        savings: "40%",
    },
]

export default function PricingPage() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
    const [config, setConfig] = useState<PricingConfig>({
        links: 1000,
        domains: 1,
        qrCodes: 100,
    })

    const updateConfig = (key: keyof PricingConfig, value: number) => {
        setConfig((prev) => ({
            ...prev,
            [key]: Math.max(0, value),
        }))
    }

    const handleInputChange = (key: keyof PricingConfig, value: string) => {
        const numValue = Number.parseInt(value) || 0
        updateConfig(key, numValue)
    }

    const handlePlanSelect = (planId: string) => {
        const plan = PREDEFINED_PLANS.find((p) => p.id === planId)
        if (plan) {
            setSelectedPlan(planId)
            setConfig(plan.config)
        }
    }

    const handleCustomChange = (key: keyof PricingConfig, value: number) => {
        setSelectedPlan(null) // Clear selected plan when user customizes
        updateConfig(key, value)
    }

    const handleCustomInputChange = (key: keyof PricingConfig, value: string) => {
        setSelectedPlan(null) // Clear selected plan when user customizes
        handleInputChange(key, value)
    }

    const calculatePlanPrice = (plan: PredefinedPlan) => {
        const basePrice =
            plan.config.links * PRICING.links + plan.config.domains * PRICING.domains + plan.config.qrCodes * PRICING.qrCodes
        return plan.originalPrice ? plan.originalPrice - (plan.originalPrice - basePrice) : basePrice
    }

    const calculateTotal = () => {
        if (selectedPlan) {
            const plan = PREDEFINED_PLANS.find((p) => p.id === selectedPlan)
            return plan ? calculatePlanPrice(plan) : 0
        }
        return config.links * PRICING.links + config.domains * PRICING.domains + config.qrCodes * PRICING.qrCodes
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(price)
    }

    return (
        <div className="max-w-6xl mx-auto py-16">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                            1
                        </div>
                        <h2 className="text-2xl font-semibold text-foreground">Choose a plan or customize</h2>
                    </div>

                    {/* Predefined Plans Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Plans</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            {PREDEFINED_PLANS.map((plan) => (
                                <Card
                                    key={plan.id}
                                    className={`p-6 cursor-pointer transition-all relative ${selectedPlan === plan.id ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-md"
                                        }`}
                                    onClick={() => handlePlanSelect(plan.id)}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <Badge className="bg-primary text-primary-foreground px-3 py-1">
                                                <Star className="w-3 h-3 mr-1" />
                                                Most Popular
                                            </Badge>
                                        </div>
                                    )}

                                    <div className="text-center mb-4">
                                        <h3 className="text-xl font-bold text-card-foreground mb-2">{plan.name}</h3>
                                        <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                                        <div className="mb-4">
                                            <div className="text-3xl font-bold text-card-foreground">
                                                {formatPrice(calculatePlanPrice(plan))}
                                            </div>
                                            {plan.originalPrice && (
                                                <div className="flex items-center justify-center gap-2 mt-1">
                                                    <span className="text-sm text-muted-foreground line-through">
                                                        {formatPrice(plan.originalPrice)}
                                                    </span>
                                                    <Badge variant="secondary" className="text-xs">
                                                        Save {plan.savings}
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Short Links</span>
                                            <span className="font-medium">{plan.config.links.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Custom Domains</span>
                                            <span className="font-medium">{plan.config.domains}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">QR Codes</span>
                                            <span className="font-medium">{plan.config.qrCodes.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {selectedPlan === plan.id && (
                                        <div className="absolute top-4 right-4">
                                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-primary-foreground" />
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-border pt-8">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Or customize your features</h3>

                        {/* Links Configuration */}
                        <Card className="p-6 bg-card border-border mb-4">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-accent-blue/20 rounded-lg flex items-center justify-center">
                                        <Link className="w-5 h-5 text-[color:var(--accent-blue)]" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-card-foreground">Short Links</h3>
                                        <p className="text-sm text-muted-foreground">Number of URLs you can shorten</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    {formatPrice(PRICING.links)} per link
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCustomChange("links", config.links - 100)}
                                        disabled={config.links <= 0}
                                        className="w-8 h-8 p-0"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <Input
                                        type="number"
                                        value={config.links}
                                        onChange={(e) => handleCustomInputChange("links", e.target.value)}
                                        className="w-24 text-center text-lg font-semibold"
                                        min="0"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCustomChange("links", config.links + 100)}
                                        className="w-8 h-8 p-0"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="flex gap-2">
                                    {STEP_SIZES.links.map((step) => (
                                        <Button
                                            key={step}
                                            variant={config.links === step ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handleCustomChange("links", step)}
                                            className="text-xs"
                                        >
                                            {step.toLocaleString()}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        {/* Domains Configuration */}
                        <Card className="p-6 bg-card border-border mb-4">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-accent-green/20 rounded-lg flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-[color:var(--accent-green)]" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-card-foreground">Custom Domains</h3>
                                        <p className="text-sm text-muted-foreground">Your own branded short domains</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    {formatPrice(PRICING.domains)} per domain
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCustomChange("domains", config.domains - 1)}
                                        disabled={config.domains <= 0}
                                        className="w-8 h-8 p-0"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <Input
                                        type="number"
                                        value={config.domains}
                                        onChange={(e) => handleCustomInputChange("domains", e.target.value)}
                                        className="w-24 text-center text-lg font-semibold"
                                        min="0"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCustomChange("domains", config.domains + 1)}
                                        className="w-8 h-8 p-0"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="flex gap-2">
                                    {STEP_SIZES.domains.map((step) => (
                                        <Button
                                            key={step}
                                            variant={config.domains === step ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handleCustomChange("domains", step)}
                                            className="text-xs"
                                        >
                                            {step}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        {/* QR Codes Configuration */}
                        <Card className="p-6 bg-card border-border">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                        <QrCode className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-card-foreground">QR Codes</h3>
                                        <p className="text-sm text-muted-foreground">Generate QR codes for your links</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    {formatPrice(PRICING.qrCodes)} per QR code
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCustomChange("qrCodes", config.qrCodes - 10)}
                                        disabled={config.qrCodes <= 0}
                                        className="w-8 h-8 p-0"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <Input
                                        type="number"
                                        value={config.qrCodes}
                                        onChange={(e) => handleCustomInputChange("qrCodes", e.target.value)}
                                        className="w-24 text-center text-lg font-semibold"
                                        min="0"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCustomChange("qrCodes", config.qrCodes + 10)}
                                        className="w-8 h-8 p-0"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="flex gap-2">
                                    {STEP_SIZES.qrCodes.map((step) => (
                                        <Button
                                            key={step}
                                            variant={config.qrCodes === step ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handleCustomChange("qrCodes", step)}
                                            className="text-xs"
                                        >
                                            {step.toLocaleString()}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                                2
                            </div>
                            <h2 className="text-2xl font-semibold text-foreground">Order summary</h2>
                        </div>

                        <Card className="p-6 bg-[color:var(--surface-elevated)] border-border">
                            <div className="space-y-4 mb-6">
                                {selectedPlan && (
                                    <div className="mb-4 p-3 bg-primary/10 rounded-lg">
                                        <div className="text-sm font-medium text-primary mb-1">
                                            {PREDEFINED_PLANS.find((p) => p.id === selectedPlan)?.name} Plan
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {PREDEFINED_PLANS.find((p) => p.id === selectedPlan)?.description}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">{config.links.toLocaleString()} Short Links</span>
                                    <span className="text-sm font-medium text-card-foreground">
                                        {formatPrice(config.links * PRICING.links)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                        {config.domains} Custom Domain{config.domains !== 1 ? "s" : ""}
                                    </span>
                                    <span className="text-sm font-medium text-card-foreground">
                                        {formatPrice(config.domains * PRICING.domains)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">{config.qrCodes.toLocaleString()} QR Codes</span>
                                    <span className="text-sm font-medium text-card-foreground">
                                        {formatPrice(config.qrCodes * PRICING.qrCodes)}
                                    </span>
                                </div>

                                {selectedPlan &&
                                    (() => {
                                        const plan = PREDEFINED_PLANS.find((p) => p.id === selectedPlan)
                                        const basePrice = plan
                                            ? plan.config.links * PRICING.links +
                                            plan.config.domains * PRICING.domains +
                                            plan.config.qrCodes * PRICING.qrCodes
                                            : 0
                                        const savings = plan?.originalPrice ? plan.originalPrice - calculatePlanPrice(plan) : 0

                                        return savings > 0 ? (
                                            <div className="flex justify-between items-center text-accent-green">
                                                <span className="text-sm">Plan Discount</span>
                                                <span className="text-sm font-medium">-{formatPrice(savings)}</span>
                                            </div>
                                        ) : null
                                    })()}

                                <div className="border-t border-border pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-semibold text-card-foreground">Total</span>
                                        <span className="text-2xl font-bold text-card-foreground">{formatPrice(calculateTotal())}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">One-time payment</p>
                                </div>
                            </div>

                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-4">
                                Continue to Payment
                            </Button>

                            <div className="space-y-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Check className="w-3 h-3 text-[color:var(--accent-green)]" />
                                    <span>No monthly fees or subscriptions</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-3 h-3 text-[color:var(--accent-green)]" />
                                    <span>Credits never expire</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-3 h-3 text-[color:var(--accent-green)]" />
                                    <span>Advanced analytics included</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-3 h-3 text-[color:var(--accent-green)]" />
                                    <span>24/7 customer support</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
