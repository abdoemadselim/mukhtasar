import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FullUrlType, ToUpdateUrlSchema, ToUpdateUrlType } from "@mukhtasar/shared"
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

import { useUpdateUrl } from "@/features/url/hooks/urls-query"


type UpdateUrlDialogProps = {
    children: React.ReactNode
    currentUrl: FullUrlType
}

export function UpdateUrlDialog({ children, currentUrl }: UpdateUrlDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ToUpdateUrlType>({
        resolver: zodResolver(ToUpdateUrlSchema),
        defaultValues: {
            original_url: currentUrl.original_url
        }
    });

    const [isOpen, setIsOpen] = useState(false)
    const { mutateAsync, isError, isPending, isSuccess } = useUpdateUrl()

    const onSubmit = async (data: ToUpdateUrlType) => {
        await mutateAsync({
            domain: currentUrl.domain as string,
            alias: currentUrl.alias as string,
            original_url: data.original_url
        });
        setIsOpen(false);
        openToaster("تم تحديث الرابط بنجاح.", "success");
        reset();
    }

    useEffect(() => {
        if (isError) {
            openToaster("حدث خطأ غير متوقع في الخادم. يرجى المحاولة لاحقًا.", "error")
        }

        if (isSuccess) {
            openToaster("تم تعديل الرابط بنجاح.", 'success');
        }
    }, [isError, isSuccess])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="flex flex-col items-start pt-4 pb-2">
                    <DialogTitle>تعديل الرابط الأصلي</DialogTitle>
                    <DialogDescription>
                        يمكنك تغيير الرابط الأصلي المرتبط بالرابط المختصر.
                    </DialogDescription>
                </DialogHeader>

                {/* The Update Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 pb-6">

                        {/* Short URL - Readonly */}
                        <div className="grid gap-3">
                            <Label htmlFor="short-url">الرابط المختصر</Label>
                            <Input
                                disabled
                                id="short-url"
                                name="short_url"
                                value={currentUrl.short_url}
                                readOnly
                                className="bg-muted"
                            />
                        </div>

                        {/* Original URL - Editable */}
                        <div className="grid gap-3">
                            <Label htmlFor="original_url">الرابط الأصلي</Label>
                            <Input
                                id="original_url"
                                {...register("original_url")}
                            />

                            {errors?.original_url && (
                                <div aria-live="polite" aria-atomic="true">
                                    <p className="text-sm text-red-500" role="alert">
                                        {errors.original_url.message}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button variant="outline" className="cursor-pointer">إلغاء</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            className="cursor-pointer"
                            disabled={isSubmitting}
                        >
                            {(isSubmitting || isPending) ? "جاري الحفظ..." : "حفظ التغييرات"}
                        </Button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog >
    )
}
