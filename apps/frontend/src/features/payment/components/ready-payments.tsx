// Libs
import { Check, Star } from "lucide-react";

// Shared
import { Card } from "@/shared/components/ui/card";
import { formatPrice } from "@/shared/lib/utils";
import { Badge } from "@/shared/components/ui/badge"

// Features
import { PREDEFINED_PLANS } from "@/features/payment/const";
import { PredefinedPlan } from "@/features/payment/types";
import { calculatePlanPrice } from "@/features/payment/utils";

export default function ReadyPayments({ onPlanSelect, selectedPlan }: { onPlanSelect: (PredefinedPlan: PredefinedPlan) => void, selectedPlan: PredefinedPlan | null }) {
    return (
        <div className="grid md:grid-cols-3 gap-4">
            {PREDEFINED_PLANS.map((plan) => (
                <Card
                    key={plan.id}
                    className={`p-6 cursor-pointer transition-all relative ${selectedPlan?.id === plan.id ? "ring-2 ring-primary bg-primary/3" : "hover:shadow-md"
                        }`}
                    onClick={() => onPlanSelect(plan)}
                >
                    {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-primary text-primary-foreground px-3 py-1">
                                <Star className="w-3 h-3 ml-1" />
                                الأكثر شعبية
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
                                        وفّر {plan.savings}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">روابط مختصرة</span>
                            <span className="font-medium">{plan.config.links}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">نطاقات مخصصة</span>
                            <span className="font-medium">{plan.config.domains}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">رموز QR</span>
                            <span className="font-medium">{plan.config.qrCodes}</span>
                        </div>
                    </div>

                    {selectedPlan?.id === plan.id && (
                        <div className="absolute top-4 left-4">
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-primary-foreground" />
                            </div>
                        </div>
                    )}
                </Card>
            ))}
        </div>
    )
}