'use client'

import { useState, useEffect } from "react"
import { Check, X } from "lucide-react"
import { FullTokenType } from "@mukhtasar/shared"

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
import { openToaster } from "@/components/ui/sonner"

import { useRegenerateToken } from "@/features/token/hooks/tokens-query"
import { TokenSuccessDialog } from "@/features/token/components/token-success-dialog"
import { useQueryClient } from "@tanstack/react-query"

type RegenerateTokenDialogProps = {
    currentToken: FullTokenType
    children: React.ReactNode
}

export function RegenerateTokenDialog({ currentToken, children }: RegenerateTokenDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)

    const { mutateAsync, isError, isPending, data, isSuccess } = useRegenerateToken()
    const queryClient = useQueryClient();

    const handleTokenRegenerate = async () => {
        await mutateAsync(currentToken.id)
        setIsOpen(false)
        setShowSuccessDialog(true)
    }

    const handleSuccessClose = () => {
        setShowSuccessDialog(false)
        queryClient.invalidateQueries({ queryKey: ["tokens"] })
    }

    useEffect(() => {
        if (isError) {
            openToaster("حدث خطأ غير متوقع في الخادم. يرجى المحاولة لاحقًا.", "error")
        }
        if (isSuccess) {
            openToaster("تم إعادة إنشاء رمز الوصول بنجاح.", "success")
        }
    }, [isError, isSuccess])

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="pt-4 pb-2">
                        <DialogTitle className="text-right text-xl font-semibold">إعادة إنشاء رمز الوصول</DialogTitle>
                        <DialogDescription className="text-right text-sm text-muted-foreground">
                            هذا الإجراء سيحذف الرمز الحالي ويُنشئ رمزًا جديدًا بنفس التسمية والصلاحيات.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2 mt-2">
                        <p className="text-md font-bold text-primary">
                            التسمية: <span className="font-semibold text-black">{currentToken.label}</span>
                        </p>
                        <p className="text-md font-bold text-primary">الصلاحيات:</p>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                {currentToken.can_create ? (
                                    <Check className="h-5 w-5 text-green-600" />
                                ) : (
                                    <X className="h-5 w-5 text-red-500" />
                                )}
                                <span className="text-sm text-black">صلاحية الإنشاء</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {currentToken.can_update ? (
                                    <Check className="h-5 w-5 text-green-600" />
                                ) : (
                                    <X className="h-5 w-5 text-red-500" />
                                )}
                                <span className="text-sm text-black">صلاحية التحديث</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {currentToken.can_delete ? (
                                    <Check className="h-5 w-5 text-green-600" />
                                ) : (
                                    <X className="h-5 w-5 text-red-500" />
                                )}
                                <span className="text-sm text-black">صلاحية الحذف</span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-start mt-6">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="cursor-pointer"
                            >
                                إلغاء
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            className="cursor-pointer"
                            onClick={() => handleTokenRegenerate()}
                        >
                            {isPending ? "جاري إعادة الإنشاء..." : "إعادة إنشاء الرمز"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >

            <TokenSuccessDialog
                isOpen={showSuccessDialog}
                onClose={handleSuccessClose}
                token={data?.token?.rawToken || ""}
            />
        </>
    )
}