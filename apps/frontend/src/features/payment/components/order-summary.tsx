// Libs
import { Check } from "lucide-react"

// Shared
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { formatPrice } from "@/shared/lib/utils"

// Features
import { PredefinedPlan, CustomPlan } from "@/features/payment/types"
import { PRICING } from "@/features/payment/const"
import { calculatePlanPrice } from "@/features/payment/utils"

export default function OrderSummary({ selectedPlan, customPlan }: { selectedPlan: PredefinedPlan | null, customPlan: CustomPlan }) {
    const calculateTotal = () => {
        if (selectedPlan) {
            return calculatePlanPrice(selectedPlan)
        }
        return customPlan.links * PRICING.links + customPlan.domains * PRICING.domains + customPlan.qrCodes * PRICING.qrCodes
    }

    return (
        <div className="lg:col-span-1">
            <div className="sticky top-8">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                        2
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground">ملخص الطلب</h2>
                </div>

                <Card className="p-6 bg-card border-border">
                    <div className="space-y-4 mb-6">
                        {selectedPlan && (
                            <div className="mb-4 p-3 bg-primary/10 rounded-lg">
                                <div className="text-sm font-medium text-primary mb-1">
                                    خطة {selectedPlan?.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {selectedPlan?.description}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{customPlan.links} رابط مختصر</span>
                            <span className="text-sm font-medium text-card-foreground">
                                {formatPrice(customPlan.links * PRICING.links)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                                {customPlan.domains} نطاق{customPlan.domains > 1 ? " مخصص" : " مخصص"}
                            </span>
                            <span className="text-sm font-medium text-card-foreground">
                                {formatPrice(customPlan.domains * PRICING.domains)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{customPlan.qrCodes} رمز QR</span>
                            <span className="text-sm font-medium text-card-foreground">
                                {formatPrice(customPlan.qrCodes * PRICING.qrCodes)}
                            </span>
                        </div>

                        {selectedPlan &&
                            (() => {
                                const savings = selectedPlan?.originalPrice ? selectedPlan.originalPrice - calculatePlanPrice(selectedPlan) : 0

                                return savings > 0 ? (
                                    <div className="flex justify-between items-center text-green-600">
                                        <span className="text-sm">خصم الخطة</span>
                                        <span className="text-sm font-medium">-{formatPrice(savings)}</span>
                                    </div>
                                ) : null
                            })()}

                        <div className="border-t border-border pt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-base font-semibold text-card-foreground">الإجمالي</span>
                                <span className="text-2xl font-bold text-card-foreground">{formatPrice(calculateTotal())}</span>
                            </div>
                        </div>
                    </div>

                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-4 cursor-pointer">
                        متابعة الدفع
                    </Button>
                </Card>
            </div>
        </div>
    )
}