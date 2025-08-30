'use client'

import { MapPin } from "lucide-react"
import { useMemo } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { useGetGeographicStats } from "@/features/analytics/hooks/analytics.hook";

const countryFlags: Record<string, string> = {
    "سعودي": "🇸🇦",
    "السعودية": "🇸🇦",
    "saudi arabia": "🇸🇦",
    "الإمارات": "🇦🇪",
    "uae": "🇦🇪",
    "united arab emirates": "🇦🇪",
    "مصر": "🇪🇬",
    "egypt": "🇪🇬",
    "قطر": "🇶🇦",
    "qatar": "🇶🇦",
    "الكويت": "🇰🇼",
    "kuwait": "🇰🇼",
    "العراق": "🇮🇶",
    "iraq": "🇮🇶",
    "الأردن": "🇯🇴",
    "jordan": "🇯🇴",
    "لبنان": "🇱🇧",
    "lebanon": "🇱🇧",
    "سوريا": "🇸🇾",
    "syria": "🇸🇾",
    "المغرب": "🇲🇦",
    "morocco": "🇲🇦",
    "تونس": "🇹🇳",
    "tunisia": "🇹🇳",
    "الجزائر": "🇩🇿",
    "algeria": "🇩🇿",
    "ليبيا": "🇱🇾",
    "libya": "🇱🇾",
    "السودان": "🇸🇩",
    "sudan": "🇸🇩",
    "اليمن": "🇾🇪",
    "yemen": "🇾🇪",
    "عمان": "🇴🇲",
    "oman": "🇴🇲",
    "البحرين": "🇧🇭",
    "bahrain": "🇧🇭",
    "فلسطين": "🇵🇸",
    "palestine": "🇵🇸",
    "unknown": "🌍",
    "غير معروف": "🌍"
};

export default function GeographicChart({ alias }: { alias: string }) {
    const { data: geographicStats, isLoading, error } = useGetGeographicStats({
        alias,
    });
    const maxClicks = useMemo(() => {
        if (!geographicStats || geographicStats.length === 0) return 1;
        return Math.max(...geographicStats.map(stat => stat.clicks));
    }, [geographicStats]);

    const countriesData = useMemo(() => {
        if (!geographicStats) return [];

        return geographicStats.slice(0, 5).map(stat => ({
            country: stat.country || "غير معروف",
            clicks: stat.clicks,
            flag: countryFlags[stat.country?.toLowerCase()] || countryFlags["unknown"]
        }));
    }, [geographicStats]);

    if (isLoading) {
        return <GeographicChartSkeleton />;
    }

    if (error || !geographicStats || geographicStats.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        التوزيع الجغرافي
                    </CardTitle>
                    <CardDescription>
                        أهم الدول حسب عدد النقرات
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center text-muted-foreground">
                        لا توجد بيانات جغرافية متاحة
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    التوزيع الجغرافي
                </CardTitle>
                <CardDescription>
                    أهم الدول حسب عدد النقرات
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {countriesData.map((country, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{country.flag}</span>
                                <span className="font-medium">{country.country}</span>
                            </div>
                            <div className="flex items-center gap-3 flex-1 ml-4">
                                <div className="flex-1 bg-secondary rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(country.clicks / maxClicks) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm font-medium w-8 text-right">
                                    {country.clicks}
                                </span>
                            </div>
                        </div>
                    ))}
                    {countriesData.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                            لا توجد بيانات جغرافية متاحة
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}


export function GeographicChartSkeleton() {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-48 mt-2" />
            </div>
            <div className="p-6 pt-0">
                <div className="space-y-3">
                    {[1, 2, 3].map((_, index) => (
                        <div key={index} className="flex items-center gap-50">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-6 w-6" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-2 w-50 rounded-full" />
                                <Skeleton className="h-4 w-8" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}