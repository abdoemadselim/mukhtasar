import Link from "next/link";
import { Check, Sparkles, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

// Plans data
const PLANS = [
    {
        id: "free",
        name: "مجاني",
        headline: "ابدأ دون تكلفة",
        badge: null as string | null,
        price: 0,
        limits: {
            links: "50",
            clicks: "10ألف/شهر",
        },
        bullets: [
            "لوحة تحليلات أساسية",
            "إدارة روابط أساسية (تعديل/حذف)",
            "نطاق مختصر افتراضي فقط",
            "تاريخ صلاحية مخصص لكل رابط",
        ],
        cta: { label: "ابدأ الآن", href: "/signup", disabled: false },
        highlight: false,
    },
    {
        id: "pro",
        name: "مميز",
        headline: "500 رابط مع نقرات غير محدودة لكل رابط",
        badge: "الأكثر شيوعًا",
        price: 9.99, // مطابق لـ TinyURL
        limits: {
            links: "500",
            clicks: "غير محدودة لكل رابط*",
        },
        bullets: [
            "تحليلات الروابط",
            "إدارة روابط متقدمة (علامات، مجلدات)",
            "نطاقات مخصصة للروابط (Branded Domains)",
            "تعديل الروابط وإعادة التوجيه",
            "تواريخ انتهاء صلاحية مخصصة",
            "روابط مجمّعة (CSV) حتى 5K/دفعة",
        ],
        footnote: "* تتبع غير محدود لنقرات 500 رابط. حتى 9.5K روابط إضافية يمكن تتبع حتى 9.5K نقرة لكلٍ منها.",
        cta: { label: "قريبًا", href: "/checkout?plan=pro", disabled: true },
        highlight: true,
    },
    {
        id: "bulk-100k",
        name: "عملاق - 100ألف",
        headline: "100 ألف رابط وتعقب غير محدود لكل رابط",
        badge: "للاستخدام المكثّف",
        price: 99.0, // مطابق لـ TinyURL
        limits: {
            links: "100 ألف",
            clicks: " عبر جميع الروابط حتى 100 ألف",
        },
        bullets: [
            "كل ميزات مميز",
            "إنشاء روابط مجمّعة ضخم (حتى 100 ألف)",
            "انتهاء صلاحية افتراضي 90 يومًا (قابل للتخصيص)",
            "نطاقات مخصّصة متعددة",
            "واجهة برمجية API مع حدود أعلى",
        ],
        footnote: "مصمم للحملات قصيرة الأجل والعمليات الضخمة ذات العلامات التجارية.",
        cta: { label: "قريبًا", disabled: true, href: "/checkout?plan=bulk-100k" },
        highlight: false,
    },
] as const;

export default function PricingPlans() {
    return (
        <section className="py-16 md:py-28">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto max-w-2xl space-y-3 text-center">
                    <h1 className="text-4xl font-semibold lg:text-5xl">خطط الأسعار</h1>
                    <p className="text-muted-foreground">اختر الخطة المناسبة لاستخدامك — يمكنك الترقية في أي وقت.</p>
                </div>

                <div className="mt-10 grid gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
                    {PLANS.map((plan) => (
                        <Card key={plan.id} className={plan.highlight ? "relative ring-2 ring-amber-300" : "relative"}>
                            {plan.badge && (
                                <span className="absolute inset-x-0 -top-3 mx-auto w-fit rounded-full bg-gradient-to-br from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-inset ring-white/20">
                                    {plan.badge}
                                </span>
                            )}

                            <div className="flex h-full flex-col">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
                                        {plan.id === "pro" && <Sparkles className="h-5 w-5" />}
                                        {plan.id === "bulk-100k" && <Zap className="h-5 w-5" />}
                                    </div>
                                    <CardDescription className="mt-1 leading-relaxed">{plan.headline}</CardDescription>
                                    <div className="mt-3 text-2xl font-semibold">
                                        ${plan.price}
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4 pb-6">
                                    <hr className="border-dashed" />

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="rounded-xl border p-2 text-center">
                                            <div className="text-xs text-muted-foreground">الروابط</div>
                                            <div className="mt-0.5 font-medium">{plan.limits.links}</div>
                                        </div>
                                        <div className="rounded-xl border p-2 text-center">
                                            <div className="text-xs text-muted-foreground">النقرات</div>
                                            <div className="mt-0.5 font-medium">{plan.limits.clicks}</div>
                                        </div>
                                    </div>

                                    <ul className="mt-2 space-y-2 text-sm">
                                        {plan.bullets.map((b, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <Check className="mt-0.5 h-3.5 w-3.5" />
                                                <span>{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter className="mt-auto">
                                    {!plan.cta.disabled ?
                                        <Button asChild className="w-full" disabled={plan.cta.disabled}>
                                            <Link href={plan.cta.href}>{plan.cta.label}</Link>
                                        </Button>
                                        : (
                                            <Button className="w-full" disabled={plan.cta.disabled}>
                                                <span>{plan.cta.label}</span>
                                            </Button>
                                        )
                                    }
                                </CardFooter>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section >
    );
}
