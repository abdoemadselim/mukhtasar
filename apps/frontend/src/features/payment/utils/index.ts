import { PredefinedPlan } from "@/features/payment/types"
import { PRICING } from "@/features/payment/const"

export const calculatePlanPrice = (plan: PredefinedPlan) => {
    const basePrice =
        plan.config.links * PRICING.links + plan.config.domains * PRICING.domains + plan.config.qrCodes * PRICING.qrCodes
    return plan.originalPrice ? plan.originalPrice - (plan.originalPrice - basePrice) : basePrice
}
