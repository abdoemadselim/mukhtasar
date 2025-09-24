'use client'

import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { openToaster } from "@/components/ui/sonner"

type DomainInstructionsDialogProps = {
    isOpen: boolean
    onClose: () => void
    domain: string
    domainType: "domain" | "subdomain"
}

export default function DomainInstructionsDialog({
    isOpen,
    onClose,
    domain,
    domainType
}: DomainInstructionsDialogProps) {
    const targetDomain = process.env.NEXT_PUBLIC_FALLBACK_ORIGIN || "custom-hostnames.yourapp.com"

    const handleCopyRecord = async (text: string) => {
        await navigator.clipboard.writeText(text)
        openToaster("تم نسخ القيمة إلى الحافظة", "success")
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader className="pb-4 pt-6">
                    <DialogTitle className="text-right text-xl font-semibold">
                        إعداد CNAME للنطاق المخصص
                    </DialogTitle>
                    <DialogDescription className="text-right text-sm text-muted-foreground">
                        يجب إضافة سجل CNAME واحد فقط في إعدادات النطاق لديك. سيتم إصدار شهادة SSL تلقائياً.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-right">
                        <h3 className="font-semibold text-blue-800 mb-2">خطوات الإعداد البسيطة:</h3>
                        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                            <li>اذهب إلى لوحة تحكم النطاق الخاص بك</li>
                            <li>ابحث عن قسم إدارة DNS أو DNS Management</li>
                            <li>أضف سجل CNAME بالقيم الموجودة بالأسفل</li>
                            <li>احفظ التغييرات</li>
                            <li>انتظر بضع دقائق لإصدار شهادة SSL التلقائية</li>
                        </ol>
                    </div>

                    {/* DNS Record Details */}
                    <div className="space-y-4">
                        <div className="grid gap-3">
                            <Label htmlFor="hostname" className="text-right font-semibold">
                                المضيف (Host/Name)
                            </Label>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleCopyRecord(domain)}
                                    className="h-10 w-10"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <Input
                                    value={domain}
                                    readOnly
                                    className="font-mono bg-gray-100"
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="record-value" className="text-right font-semibold">
                                يشير إلى (Points To / Target)
                            </Label>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleCopyRecord(targetDomain)}
                                    className="h-10 w-10"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <Input
                                    value={targetDomain}
                                    readOnly
                                    className="font-mono bg-gray-100"
                                    dir="ltr"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Record Summary Table */}
                    <div className="bg-gray-50 border rounded-lg p-4">
                        <h4 className="font-semibold mb-3 text-right">ملخص السجل المطلوب:</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-right p-2 font-medium">النوع</th>
                                        <th className="text-right p-2 font-medium">المضيف</th>
                                        <th className="text-right p-2 font-medium">يشير إلى</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-2 font-mono bg-blue-100 rounded">CNAME</td>
                                        <td className="p-2 font-mono bg-yellow-100 rounded" dir="ltr">
                                            {domain}
                                        </td>
                                        <td className="p-2 font-mono bg-green-100 rounded" dir="ltr">
                                            {targetDomain}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-right">
                        <p className="text-sm text-yellow-800">
                            <strong>ملاحظة:</strong> سيتم إصدار شهادة SSL تلقائياً خلال بضع دقائق من إضافة سجل CNAME.
                            لا تحتاج لأي إعدادات إضافية.
                        </p>
                    </div>
                </div>

                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button variant="default" className="cursor-pointer">
                            إغلاق
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}