'use client'

import { useState } from "react"
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
}

export default function DomainInstructionsDialog({ isOpen, onClose, domain }: DomainInstructionsDialogProps) {
    const targetDomain = process.env.NEXT_PUBLIC_DOMAIN_TARGET || "domains.mukhtasar.pro"

    const handleCopyRecord = async (text: string) => {
        await navigator.clipboard.writeText(text)
        openToaster("تم نسخ القيمة إلى الحافظة", "success")
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader className="pb-4 pt-6">
                    <DialogTitle className="text-right text-xl font-semibold">
                        إعداد سجل DNS للنطاق
                    </DialogTitle>
                    <DialogDescription className="text-right text-sm text-muted-foreground">
                        يجب إضافة سجل CNAME في إعدادات النطاق لديك لتفعيل النطاق المخصص
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-right">
                        <h3 className="font-semibold text-blue-800 mb-2">خطوات الإعداد:</h3>
                        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                            <li>اذهب إلى لوحة تحكم النطاق الخاص بك</li>
                            <li>ابحث عن قسم إدارة DNS أو DNS Management</li>
                            <li>أضف سجل CNAME جديد بالقيم الموجودة بالأسفل</li>
                            <li>احفظ التغييرات</li>
                        </ol>
                    </div>

                    {/* DNS Record Details */}
                    <div className="space-y-4">
                        <div className="grid gap-3">
                            <Label htmlFor="record-type" className="text-right font-semibold">
                                نوع السجل (Record Type)
                            </Label>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleCopyRecord("CNAME")}
                                    className="h-10 w-10"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <Input
                                    value="CNAME"
                                    readOnly
                                    className="font-mono bg-gray-100"
                                />
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="record-value" className="text-right font-semibold">
                                القيمة (Value/Target)
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

                    {/* Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-right">
                        <p className="text-sm text-yellow-800">
                            <strong>ملاحظة مهمة:</strong> قد يستغرق انتشار تغييرات DNS من بضع دقائق إلى 48 ساعة.
                            سيتم التحقق من النطاق تلقائياً وسيصبح نشطاً بمجرد اكتمال الانتشار.
                        </p>
                    </div>

                    {/* Current Status */}
                    <div className="bg-gray-50 border rounded-lg p-4 text-right">
                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <span className="font-semibold">النطاق:</span> {domain}
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-gray-600">قيد المراجعة</span>
                            </div>
                        </div>
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