'use client'

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TokenSchema, TokenType } from "@mukhtasar/shared"

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
import { openToaster } from "@/components/ui/sonner"

import { useCreateToken } from "@/features/token/hooks/tokens-query"
import { TokenSuccessDialog } from "@/features/token/components/token-success-dialog"


export default function CreateTokenDialog({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<TokenType>({
        resolver: zodResolver(TokenSchema),
        defaultValues: {
            label: "",
            can_create: false,
            can_update: false,
            can_delete: false,
        },
    })

    const { mutateAsync, isError, isPending, data, isSuccess } = useCreateToken()

    const onSubmit = async (data: TokenType) => {
        await mutateAsync(data)

        setIsOpen(false)
        setShowSuccessDialog(true)
        reset()
    }

    useEffect(() => {
        if (isError) {
            openToaster("حدث خطأ غير متوقع في الخادم. يرجى المحاولة لاحقًا.", "error")
        }

        if (isSuccess) {
            openToaster("تم إنشاء رمز الوصول بنجاح.", "success")
        }
    }, [isError, isSuccess])

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogHeader className="flex flex-col items-start pt-4 pb-2">
                            <DialogTitle>إنشاء رمز وصول جديد</DialogTitle>
                            <DialogDescription>
                                أدخل تسمية للرمز وحدد الصلاحيات المطلوبة.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            {/* Label */}
                            <div className="grid gap-3">
                                <Label htmlFor="label">التسمية <span className="text-red-500">*</span></Label>
                                <Input
                                    {...register("label")}
                                    id="label"
                                    placeholder="مثال: Production API"
                                />
                                {errors?.label && (
                                    <div id="label-error" aria-live="polite" aria-atomic="true">
                                        <p className="text-sm text-red-500" role="alert">
                                            {errors.label.message}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Permissions */}
                            <div className="grid gap-4">
                                <Label className="text-base font-medium">الصلاحيات</Label>

                                <div className="flex items-center gap-3">
                                    <Controller
                                        name="can_create"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                id="can_create"
                                            />
                                        )}
                                    />
                                    <Label htmlFor="can_create" className="text-sm font-normal">
                                        صلاحية الإنشاء
                                    </Label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Controller
                                        name="can_update"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                id="can_update"
                                            />
                                        )}
                                    />
                                    <Label htmlFor="can_update" className="text-sm font-normal">
                                        صلاحية التحديث
                                    </Label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Controller
                                        name="can_delete"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                id="can_delete"
                                            />
                                        )}
                                    />
                                    <Label htmlFor="can_delete" className="text-sm font-normal">
                                        صلاحية الحذف
                                    </Label>
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
                                disabled={isSubmitting || isPending}
                            >
                                {(isSubmitting) ? "جاري الإنشاء..." : "إنشاء الرمز"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <TokenSuccessDialog
                isOpen={showSuccessDialog}
                onClose={() => setShowSuccessDialog(false)}
                token={data?.token?.rawToken || ""}
            />
        </>
    )
}
