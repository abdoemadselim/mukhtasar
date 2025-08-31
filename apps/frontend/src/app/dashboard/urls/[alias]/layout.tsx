
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function UrlAnalyticsLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ alias: string }>
}>) {

    const { alias } = await params

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/urls">
                    <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                    >
                        <ArrowLeft
                            className="h-4 w-4" />
                        العودة
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">
                        تحليلات الرابط
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{alias}</Badge>
                        <span className="text-muted-foreground">•</span>
                    </div>
                </div>
            </div>
            {children}
        </div>
    )
}