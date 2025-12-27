import { Download } from "lucide-react"
import Image from "next/image.js"

import { Button } from "@/shared/components/ui/button"

interface QRCodePreviewProps {
    onDownload: () => void
    previewQrCode: string
    isPending: boolean
}

export default function QRCodePreview({ onDownload, previewQrCode, isPending }: QRCodePreviewProps) {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 pb-8">
            {/* Preview QR Code */}
            <Image
                src={previewQrCode}
                alt="معاينة كود QR"
                width={240}
                height={310}
                className="h-auto w-auto object-contain"
            />
            <Button
                type="button"
                variant="outline"
                onClick={onDownload}
                className="cursor-pointer"
                disabled={isPending || !previewQrCode}
            >
                <Download className="h-4 w-4 ml-2" />
                حمله للتأكد من مظهره قبل الإنشاء
            </Button>

            <p className="text-center text-sm max-w-[300px] text-gray-600">
                هذا الكود للمعاينة فقط، فلا تنسخه الآن. سيتم إنشاء الكود بمجرد الانتهاء.
            </p>
        </div>
    )
}