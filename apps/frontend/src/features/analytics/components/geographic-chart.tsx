'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin } from "lucide-react"

const countriesData = [
    { country: "السعودية", clicks: 89, flag: "🇸🇦" },
    { country: "الإمارات", clicks: 67, flag: "🇦🇪" },
    { country: "مصر", clicks: 45, flag: "🇪🇬" },
    { country: "قطر", clicks: 34, flag: "🇶🇦" },
    { country: "الكويت", clicks: 23, flag: "🇰🇼" }
]

export default function GeographicChart() {
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
                <div className="space-y-3">
                    {countriesData.map((country, index) => (
                        <div key={index} className="flex items-center gap-50">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{country.flag}</span>
                                <span className="font-medium">{country.country}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-50 bg-secondary rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full"
                                        style={{ width: `${(country.clicks / 89) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm font-medium w-8 text-right">
                                    {country.clicks}
                                </span>
                            </div>
                        </div>
                    ))}
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