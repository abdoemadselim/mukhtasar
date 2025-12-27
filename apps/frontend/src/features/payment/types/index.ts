export interface CustomPlan {
    links: number
    domains: number
    qrCodes: number
}

export interface PredefinedPlan {
    id: number
    name: string
    description: string
    popular?: boolean
    config: CustomPlan
    originalPrice?: number
    savings?: string
}
