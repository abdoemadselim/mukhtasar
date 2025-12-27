// Libs
import { Minus, Plus, Link } from "lucide-react"

// Shared
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/shared/lib/utils"

// Features
import { PRICING, STEP_SIZES } from "@/features/payment/const"
import { CustomPlan } from "@/features/payment/types"

export default function CustomPlanLinks({ customPlan, onCustomPlanChange }: { customPlan: CustomPlan, onCustomPlanChange: (key: keyof CustomPlan, value: number | string) => void }) {
    return (
        <Card className="p-6 bg-card border-border mb-4">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Link className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-card-foreground">روابط مختصرة</h3>
                        <p className="text-sm text-muted-foreground">عدد الروابط التي يمكنك اختصارها</p>
                    </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                    {formatPrice(PRICING.links)} لكل رابط
                </Badge>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCustomPlanChange("links", customPlan.links - 100)}
                        disabled={customPlan.links <= 0}
                        className="w-8 h-8 p-0"
                    >
                        <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                        type="number"
                        value={customPlan.links}
                        onChange={(e) => onCustomPlanChange("links", e.target.value)}
                        className="w-24 text-center text-lg font-semibold"
                        min="0"
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCustomPlanChange("links", customPlan.links + 100)}
                        className="w-8 h-8 p-0"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex gap-2">
                    {STEP_SIZES.links.map((step) => (
                        <Button
                            key={step}
                            variant={customPlan.links === step ? "default" : "outline"}
                            size="sm"
                            onClick={() => onCustomPlanChange("links", step)}
                            className="text-xs"
                        >
                            {step}
                        </Button>
                    ))}
                </div>
            </div>
        </Card>
    )
}