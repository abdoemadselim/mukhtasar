'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { ShortUrlSchema, ShortUrlType } from "@mukhtasar/shared"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

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
import { openToaster } from "@/components/ui/sonner"

import { useCreateUrl } from "@/features/url/hooks/urls-query"

export function CreateUrlDialog({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ShortUrlType>({
        resolver: zodResolver(ShortUrlSchema),
        defaultValues: {
            original_url: "",
            alias: "",
            domain: "",
            description: "",
        },
    })

    const { mutateAsync, isError, isSuccess } = useCreateUrl()

    const onSubmit = async (data: ShortUrlType) => {
        await mutateAsync(data)

        setIsOpen(false)
        reset()
    }

    useEffect(() => {
        if (isError) {
            openToaster("حدث خطأ غير متوقع في الخادم. يرجى المحاولة لاحقًا.", "error")
        }

        if (isSuccess) {
            openToaster("تم إنشاء الرابط بنجاح.", "success")
        }
    }, [isError, isSuccess])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] pt-10">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader className="pb-2">
                        <DialogTitle className="text-right">إنشاء رابط مختصر</DialogTitle>
                        <DialogDescription className="text-right">
                            أدخل الرابط الأصلي وقم بتخصيص بيانات الرابط المختصر إذا رغبت.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 pb-6">
                        {/* Original URL (required) */}
                        <div className="grid gap-3">
                            <Label htmlFor="original_url">الرابط الأصلي <span className="text-red-500">*</span></Label>
                            <Input
                                {...register("original_url")}
                                id="original_url"
                                placeholder="https://example.com/page"
                            />

                            {errors?.original_url && (
                                <div id="label-error" aria-live="polite" aria-atomic="true">
                                    <p className="text-sm text-red-500" role="alert">
                                        {errors.original_url.message}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Optional description */}
                        <div className="grid gap-3">
                            <Label htmlFor="description">الوصف (اختياري)</Label>
                            <Input
                                id="description"
                                {...register("description")}
                                placeholder="أدخل وصفاً للرابط"
                            />
                            {errors?.description && (
                                <div id="label-error" aria-live="polite" aria-atomic="true">
                                    <p className="text-sm text-red-500" role="alert">
                                        {errors.description.message}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Optional alias */}
                        <div className="grid gap-3">
                            <Label htmlFor="alias">الاسم المستعار (اختياري).</Label>
                            <Input
                                id="alias"
                                {...register("alias")}
                                placeholder="مثال: my-link"
                            />

                            {errors?.alias && (
                                <div id="label-error" aria-live="polite" aria-atomic="true">
                                    <p className="text-sm text-red-500" role="alert">
                                        {errors.alias.message}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Optional domain */}
                        <div className="grid gap-3">
                            <Label htmlFor="domain">النطاق (اختياري)</Label>
                            <Input
                                id="domain"
                                {...register("domain")}
                                placeholder="مثال: short.me"
                            />

                            {errors?.domain && (
                                <div id="label-error" aria-live="polite" aria-atomic="true">
                                    <p className="text-sm text-red-500" role="alert">
                                        {errors.domain.message}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button variant="outline" className="cursor-pointer">إلغاء</Button>
                        </DialogClose>
                        <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>{isSubmitting ? "جاري الإنشاء..." : "إنشاء الرابط"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}
