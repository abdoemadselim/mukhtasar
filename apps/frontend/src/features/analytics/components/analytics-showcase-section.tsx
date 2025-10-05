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
import Link from "next/link"

import Highlighter from "@/shared/components/ui/highlighter"
import { Button } from "@/shared/components/ui/button"
import WobbleCard from "@/shared/components/ui/wobble-card"

const analyticsFeatures = [
    {
        icon: MousePointer,
        title: "إجمالي  الزوار ",
        description: "عدد الزيارات الكلية مع متوسط الزيارات اليومية لكل رابط",
        bg: "bg-indigo-900", // Dark & bold for total/summary metric
    },
    {
        icon: Users,
        title: "الزوار الجدد",
        description: "عدد الزوار الجدد الذين زاروا روابطك",
        bg: "bg-purple-700", // Slightly different dark shade
    },
    {
        icon: BarChart3,
        title: "الزيارات عبر الزمن",
        description: "رسوم بيانية تفاعلية لتتبع أداء روابطك خلال فترات زمنية مختلفة",
        bg: "bg-pink-900", // Warmer dark tone, distinct from above
    },
    {
        icon: Globe,
        title: "التوزيع الجغرافي",
        description: "معرفة البلدان التي يأتي منها زوار روابطك",
        bg: "bg-blue-900",
    },
    {
        icon: Smartphone,
        title: "أنواع الأجهزة",
        description: "تفاصيل عن الأجهزة المستخدمة: موبايل، كمبيوتر، تابليت",
        bg: "bg-amber-800", // Soft gradient for segmentation data
    },
    {
        icon: Activity,
        title: "المتصفحات المستخدمة",
        description: "إحصائيات مفصلة عن أنواع المتصفحات: Chrome، Safari، Firefox",
        bg: "bg-orange-800",
    },
    {
        icon: Clock,
        title: "النشاط بالساعات",
        description: "معرفة أفضل أوقات اليوم لنشر روابطك حسب نشاط الجمهور",
        bg: "bg-emerald-800",
    },
    {
        icon: Map,
        title: "المصادر المرجعية",
        description: "المواقع والشبكات الاجتماعية التي تجلب أكثر الزيارات لروابطك",
        bg: "bg-green-800",
    },
    {
        icon: Calendar,
        title: "الأيام النشطة",
        description: "تحليل الأيام الأكثر نشاطاً ومعدل الزيارات لكل يوم",
        bg: "bg-rose-800",
    }
]


export default function AnalyticsShowcaseSection() {
    return (
        <section className="py-20 px-6" id="more-analytics">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="sm:text-4xl text-2xl lg:text-5xl font-bold mb-6">
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
                        <WobbleCard key={index} containerClassName={`${feature.bg} group`}>
                            <div className="relative text-center">
                                {/* Animated Icon Container */}
                                <div className={`relative w-20 h-20 mx-auto mb-8 rounded-2xl p-0.5`}>
                                    <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
                                        <feature.icon className="w-10 h-10 text-white group-hover:animate-pulse" />
                                    </div>
                                </div>

                                <h3 className="text-4xl font-bold mb-4 text-white">
                                    {feature.title}
                                </h3>

                                <p className="text-white/70 leading-relaxed text-xl">
                                    {feature.description}
                                </p>
                            </div>
                        </WobbleCard>
                    ))}
                </div>

                {/* Call to Action */}
                < div className="text-center mt-16" >
                    <div className="inline-block p-6 bg-primary/5 rounded-2xl">
                        <p className="text-lg text-gray-700 mb-4">
                            🚀 <strong>جميع هذه الإحصائيات متاحة مجاناً</strong> لكل رابط تقوم بإنشائه
                        </p>
                        <Button className="inline-flex cursor-pointer items-center px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg" asChild>
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