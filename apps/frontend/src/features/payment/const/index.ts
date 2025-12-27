import { PredefinedPlan } from "@/features/payment/types"

export const PRICING = {
    links: 0.01,
    domains: 5.0,
    qrCodes: 0.05,
}

export const STEP_SIZES = {
    links: [100, 500, 1000, 5000],
    domains: [1, 3, 5, 10],
    qrCodes: [50, 100, 500, 1000],
}

export const PREDEFINED_PLANS: PredefinedPlan[] = [
    {
        id: 1,
        name: "المبتدئ",
        description: "مثالي للمشاريع الشخصية والشركات الصغيرة",
        config: {
            links: 500,
            domains: 1,
            qrCodes: 50,
        },
        originalPrice: 12.5,
        savings: "20%",
    },
    {
        id: 2,
        name: "المحترف",
        description: "مثالي للشركات النامية",
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
        id: 3,
        name: "المؤسسات",
        description: "للمؤسسات الكبيرة ذات الاحتياجات العالية",
        config: {
            links: 10000,
            domains: 10,
            qrCodes: 1000,
        },
        originalPrice: 200,
        savings: "40%",
    },
]