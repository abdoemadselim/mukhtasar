
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, MousePointer } from "lucide-react"

const url = {
    "id": 1,
    "alias": "grok1",
    "domain": "x.ai",
    "original_url": "https://x.com/grok",
    "created_at": "2024-01-01",
    "description": "Grok profile",
    "clicks": "100",
    "short_url": "https://x.ai/grok1"
}

export default function StatsCards() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium">إجمالي النقرات</CardTitle>
                    <MousePointer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{url.clicks}</div>
                    <p className="text-xs text-muted-foreground">
                        +12% من الأسبوع الماضي
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium">تاريخ الإنشاء</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{url.created_at}</div>
                    <p className="text-xs text-muted-foreground">
                        منذ {Math.floor(Math.random() * 30 + 1)} يوماً
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export function StatsCardsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-row items-center justify-between space-y-0 p-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                </div>
                <div className="p-6 pt-0">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-3 w-28 mt-2" />
                </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-row items-center justify-between space-y-0 p-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                </div>
                <div className="p-6 pt-0">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-3 w-28 mt-2" />
                </div>
            </div>
        </div>
    )
}