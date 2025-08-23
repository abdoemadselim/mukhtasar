'use client'

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

import { TokenSuccessDialog } from "@/features/tokens/components/token-success-dialog"

export default function CreateTokenDialog({ children }: { children: React.ReactNode }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)
    const [createdToken, setCreatedToken] = useState("")
    const [tokenLabel, setTokenLabel] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const label = formData.get("label") as string

        // Mock token generation - replace with your API call
        const mockToken = "tk_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

        setTokenLabel(label)
        setCreatedToken(mockToken)
        setIsCreateOpen(false)
        setShowSuccessDialog(true)
    }

    return (
        <>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] pt-10">
                    <DialogHeader className="pb-2">
                        <DialogTitle className="text-right">إنشاء رمز وصول جديد</DialogTitle>
                        <DialogDescription className="text-right">
                            أدخل تسمية للرمز وحدد الصلاحيات المطلوبة.
                        </DialogDescription>
                    </DialogHeader>

                    {/* The Creation Form */}
                    <form onSubmit={handleSubmit} >
                        <div className="grid gap-4 pb-8">
                            {/* Label (required) */}
                            <div className="grid gap-3 pb-4">
                                <Label htmlFor="label">التسمية <span className="text-red-500">*</span></Label>
                                <Input
                                    id="label"
                                    name="label"
                                    placeholder="مثال: Production API"
                                    required
                                    maxLength={100}
                                />
                            </div>

                            {/* Permissions */}
                            <div className="grid gap-4">
                                <Label className="text-base font-medium">الصلاحيات</Label>

                                <div className="flex items-center space-x-2 space-x-reverse">
                                    <Checkbox
                                        id="can_create"
                                        name="can_create"
                                    />
                                    <Label htmlFor="can_create" className="text-sm font-normal">
                                        صلاحية الإنشاء
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2 space-x-reverse">
                                    <Checkbox
                                        id="can_update"
                                        name="can_update"
                                    />
                                    <Label htmlFor="can_update" className="text-sm font-normal">
                                        صلاحية التحديث
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2 space-x-reverse">
                                    <Checkbox
                                        id="can_delete"
                                        name="can_delete"
                                    />
                                    <Label htmlFor="can_delete" className="text-sm font-normal">
                                        صلاحية الحذف
                                    </Label>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                                <Button variant="outline" className="cursor-pointer">إلغاء</Button>
                            </DialogClose>
                            <Button type="submit" className="cursor-pointer">إنشاء الرمز</Button>
                        </DialogFooter>
                    </form>

                </DialogContent>
            </Dialog >

            <TokenSuccessDialog
                isOpen={showSuccessDialog}
                onClose={() => setShowSuccessDialog(false)}
                token={createdToken}
                label={tokenLabel}
            />
        </>
    )
}