import React, { useEffect, useState } from 'react';
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { ToUpdateTokenSchema, ToUpdateTokenType } from '@mukhtasar/shared';

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
import { openToaster } from '@/components/ui/sonner';

import { useUpdateToken } from '@/features/token/hooks/tokens-query';


type UpdateTokenDialogProps = {
    children: React.ReactNode
    currentToken: ToUpdateTokenType & { id: number }
}

export default function UpdateTokenDialog({ children, currentToken }: UpdateTokenDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        control
    } = useForm<ToUpdateTokenType>({
        resolver: zodResolver(ToUpdateTokenSchema),
        defaultValues: currentToken
    });

    const [isOpen, setIsOpen] = useState(false)
    const { mutateAsync, isError, isPending, isSuccess } = useUpdateToken()

    const onSubmit = async (data: ToUpdateTokenType) => {
        await mutateAsync({
            id: currentToken.id,
            label: data.label,
            can_create: data.can_create,
            can_delete: data.can_delete,
            can_update: data.can_update
        });
        setIsOpen(false);
        openToaster("تم تحديث الرمز بنجاح.", "success");
        reset();
    };

    useEffect(() => {
        if (isError) {
            openToaster("حدث خطأ غير متوقع في الخادم. يرجى المحاولة لاحقًا.", "error")
        }

        if (isSuccess) {
            openToaster("تم تعديل رمز المرور بنجاح.", 'success');
        }
    }, [isError, isSuccess])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(onSubmit)} id="update-token-form">
                    <DialogHeader className="flex flex-col items-start pt-4 pb-2">
                        <DialogTitle>تعديل رمز الوصول</DialogTitle>
                        <DialogDescription>
                            يمكنك تغيير تسمية الرمز أو تحديث صلاحياته.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        {/* Label */}
                        <div className="grid gap-3">
                            <Label htmlFor="label">التسمية</Label>
                            <Input
                                {...register("label")}
                                name="label"
                                id="label"
                            />
                            {errors?.label && (
                                <div aria-live="polite" aria-atomic="true">
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
                            disabled={isSubmitting}
                        >
                            {(isSubmitting || isPending) ? "جاري الحفظ..." : "حفظ التغييرات"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}