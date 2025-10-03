import { Download } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

interface QRCodePreviewProps {
    onDownload: () => void
    previewQrCode: string
    isPending: boolean
}

export default function QRCodePreview({ onDownload, previewQrCode, isPending }: QRCodePreviewProps) {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 pb-8">
            {/* Loading dots */}
            {isPending ? (
                <div className="w-[240px] h-[310px]">
                    <div className="flex space-x-1 justify-center pt-4">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-200 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            ) : (
                <div className="border-dashed border-1">
                    {previewQrCode && (
                        <Image
                            src={previewQrCode}
                            alt="معاينة كود QR"
                            width={240}
                            height={310}
                            className="h-auto w-auto object-contain"
                        />
                    )}
                </div>
            )}
            <Button
                type="button"
                variant="outline"
                onClick={onDownload}
                className="cursor-pointer"
                disabled={isPending || !previewQrCode}
            >
                <Download className="h-4 w-4 ml-2" />
                تحميل المعاينة
            </Button>

            <p className="text-center text-sm max-w-[300px] text-gray-600">
                {isPending
                    ? "جاري إنشاء المعاينة..."
                    : "هذا الكود للمعاينة فقط، فلا تنسخه الآن. سيتم إنشاء كودك بمجرد الانتهاء."
                }
            </p>
        </div>
    )
}