'use client'

import {
    MousePointer,
    Users,
    Clock,
    Globe,
    Smartphone,
    Calendar,
    BarChart3,
    Map,
    Activity
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import { Highlighter } from "@/components/ui/highlighter"
import { Button } from "@/components/ui/button"

const analyticsFeatures = [
    {
        icon: MousePointer,
        title: "إجمالي  الزوار ",
        description: "عدد الزيارات الكلية مع متوسط الزيارات اليومية لكل رابط",
        gradient: "from-blue-600 to-cyan-600",
        bgGradient: "from-blue-50 to-cyan-50",
        shadowColor: "shadow-blue-500/25"
    },
    {
        icon: Users,
        title: "الزوار الجدد",
        description: "عدد الزوار الجدد الذين زاروا روابطك",
        gradient: "from-purple-600 to-pink-600",
        bgGradient: "from-purple-50 to-pink-50",
        shadowColor: "shadow-purple-500/25"
    },
    {
        icon: BarChart3,
        title: "الزيارات عبر الزمن",
        description: "رسوم بيانية تفاعلية لتتبع أداء روابطك خلال فترات زمنية مختلفة",
        gradient: "from-emerald-600 to-teal-600",
        bgGradient: "from-emerald-50 to-teal-50",
        shadowColor: "shadow-emerald-500/25"
    },
    {
        icon: Globe,
        title: "التوزيع الجغرافي",
        description: "معرفة البلدان التي يأتي منها زوار روابطك",
        gradient: "from-orange-600 to-red-600",
        bgGradient: "from-orange-50 to-red-50",
        shadowColor: "shadow-orange-500/25",
    },
    {
        icon: Smartphone,
        title: "أنواع الأجهزة",
        description: "تفاصيل عن الأجهزة المستخدمة: موبايل، كمبيوتر، تابليت",
        gradient: "from-violet-600 to-purple-600",
        bgGradient: "from-violet-50 to-purple-50",
        shadowColor: "shadow-violet-500/25",
    },
    {
        icon: Activity,
        title: "المتصفحات المستخدمة",
        description: "إحصائيات مفصلة عن أنواع المتصفحات: Chrome، Safari، Firefox",
        gradient: "from-indigo-600 to-blue-600",
        bgGradient: "from-indigo-50 to-blue-50",
        shadowColor: "shadow-indigo-500/25",
    },
    {
        icon: Clock,
        title: "النشاط بالساعات",
        description: "معرفة أفضل أوقات اليوم لنشر روابطك حسب نشاط الجمهور",
        gradient: "from-amber-600 to-orange-600",
        bgGradient: "from-amber-50 to-orange-50",
        shadowColor: "shadow-amber-500/25",
    },
    {
        icon: Map,
        title: "المصادر المرجعية",
        description: "المواقع والشبكات الاجتماعية التي تجلب أكثر الزيارات لروابطك",
        gradient: "from-rose-600 to-pink-600",
        bgGradient: "from-rose-50 to-pink-50",
        shadowColor: "shadow-rose-500/25",
    },
    {
        icon: Calendar,
        title: "الأيام النشطة",
        description: "تحليل الأيام الأكثر نشاطاً ومعدل الزيارات لكل يوم",
        gradient: "from-green-600 to-emerald-600",
        bgGradient: "from-green-50 to-emerald-50",
        shadowColor: "shadow-green-500/25",
    }
]


export default function AnalyticsShowcaseSection() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    return (
        <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                        <Highlighter action="underline" strokeWidth={2} color="blue">
                            إحصائيات تفصيلية لكل رابط
                        </Highlighter>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        احصل على رؤى عميقة حول أداء روابطك المختصرة مع تحليلات شاملة ومفصلة
                    </p>
                </div>


                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {analyticsFeatures.map((feature, index) => (
                        <Card
                            key={index}
                            className={`group relative overflow-hidden border-0 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:bg-white/10 ${hoveredIndex === index ? 'shadow-2xl shadow-purple-500/25' : ''
                                }`}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Gradient Border */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`}></div>
                            <div className="absolute inset-[1px] bg-slate-900/95 backdrop-blur-xl rounded-xl"></div>

                            <CardContent className="relative p-8 text-center">
                                {/* Animated Icon Container */}
                                <div className={`relative w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-r ${feature.gradient} p-0.5 group-hover:scale-110 transition-transform duration-500`}>
                                    <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
                                        <feature.icon className="w-10 h-10 text-white group-hover:animate-pulse" />
                                    </div>

                                    {/* Glow Effect */}
                                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10`}></div>
                                </div>

                                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 group-hover:bg-clip-text transition-all duration-500">
                                    {feature.title}
                                </h3>

                                <p className="text-white/70 leading-relaxed text-base group-hover:text-white/90 transition-colors duration-500">
                                    {feature.description}
                                </p>

                                {/* Hover Effect Indicators */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                    <div className={`w-2 h-2 rounded-full bg-white/30 transition-all duration-500 ${hoveredIndex === index ? 'bg-white scale-125' : ''}`}></div>
                                    <div className={`w-2 h-2 rounded-full bg-white/20 transition-all duration-500 delay-100 ${hoveredIndex === index ? 'bg-white/70 scale-110' : ''}`}></div>
                                    <div className={`w-2 h-2 rounded-full bg-white/10 transition-all duration-500 delay-200 ${hoveredIndex === index ? 'bg-white/50 scale-105' : ''}`}></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16">
                    <div className="inline-block p-6 bg-primary/5 rounded-2xl">
                        <p className="text-lg text-gray-700 mb-4">
                            🚀 <strong>جميع هذه الإحصائيات متاحة مجاناً</strong> لكل رابط تقوم بإنشائه
                        </p>
                        <Button className="px-8 text-lg py-2 mt-7 sm:mt-2 cursor-pointer" asChild>
                            <Link
                                href="/auth/signup"
                            >
                                اشترك الآن مجانًا
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}