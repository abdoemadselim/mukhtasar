"use client"

// Libs
import { useState } from "react"

// Features
import { PredefinedPlan, CustomPlan } from "@/features/payment/types"
import { PREDEFINED_PLANS } from "@/features/payment/const"
import ReadyPayments from "@/features/payment/components/ready-payments"
import OrderSummary from "@/features/payment/components/order-summary"
import CustomPlanLinks from "@/features/payment/components/custom-plan-links"
import CustomPlanDomains from "@/features/payment/components/custom-plan-domains"
import CustomPlanQrCodes from "@/features/payment/components/custom-plan-qrcodes"

export default function PricingPage() {
    const [selectedPlan, setSelectedPlan] = useState<PredefinedPlan | null>(PREDEFINED_PLANS[1])
    const [customPlan, setCustomPlan] = useState<CustomPlan>({
        links: 1000,
        domains: 1,
        qrCodes: 100,
    })

    const handlePlanSelect = (plan: PredefinedPlan) => {
        setSelectedPlan(plan)
        setCustomPlan(plan?.config)
    }

    const handleCustomPlanChange = (key: keyof CustomPlan, value: number | string) => {
        setSelectedPlan(null)
        let numValue = value;
        if (typeof value == "string")
            numValue = Number.parseInt(value) || 0

        setCustomPlan((prev) => ({
            ...prev,
            [key]: Math.max(0, numValue as number),
        }))
    }

    return (
        <div className="max-w-6xl mx-auto py-16 px-4" dir="rtl">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                            1
                        </div>
                        <h2 className="sm:text-2xl text-xl font-semibold text-foreground">اختر خطة جاهزة أو ابنئ خطة حسب احتياجك</h2>
                    </div>

                    {/* Predefined Plans Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-foreground mb-4">الخطط الجاهزة</h3>
                        <ReadyPayments onPlanSelect={handlePlanSelect} selectedPlan={selectedPlan} />
                    </div>

                    <div className="border-t border-border pt-8">
                        <h3 className="text-lg font-semibold text-foreground mb-4">أو ابنئ خطتك</h3>

                        {/* Links Configuration */}
                        <CustomPlanLinks onCustomPlanChange={handleCustomPlanChange} customPlan={customPlan} />

                        {/* Domains Configuration */}
                        <CustomPlanDomains onCustomPlanChange={handleCustomPlanChange} customPlan={customPlan} />

                        {/* QR Codes Configuration */}
                        <CustomPlanQrCodes onCustomPlanChange={handleCustomPlanChange} customPlan={customPlan} />
                    </div>
                </div>

                {/* Order Summary */}
                <OrderSummary selectedPlan={selectedPlan} customPlan={customPlan} />
            </div>
        </div>
    )
}