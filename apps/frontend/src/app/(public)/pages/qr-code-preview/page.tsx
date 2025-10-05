'use client'

import { ArrowLeft, CheckCircle, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"

export default function QRCodePreviewPage() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center pt-8 pb-16 p-4">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-6">
                        أنت على وشك الانتهاء!
                    </h1>
                    <p className="text-lg text-gray-600">
                        لا تنس إنهاء إنشاء كود QR الخاص بك.
                    </p>
                </div>

                {/* Main Content */}
                <Card className="bg-white shadow-lg">
                    <CardContent className="px-8">
                        <div className="text-center">
                            <p className="text-gray-700 mb-6 text-lg">
                                إذا كنت ترى هذه الرسالة، فإن كود QR الخاص بك لا يزال في مرحلة المعاينة.
                                تأكد من إنهاء تخصيص كود QR الخاص بك ثم اختر &quot;إنشاء كود QR&quot;.
                            </p>

                            <Button asChild variant="outline" className="w-full">
                                <Link href="/dashboard/qr-codes">
                                    <ArrowLeft className="h-5 w-5 ml-2" />
                                    العودة إلى لوحة التحكم
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
