'use client'

import { useState } from 'react';
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetPasswordMailSchema, ResetPasswordMailType } from '@mukhtasar/shared'
import { SubmitHandler, useForm } from "react-hook-form"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { requestPasswordReset } from '@/features/auth/service/auth';

export default function SendResetPasswordMail() {
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<ResetPasswordMailType>({
        resolver: zodResolver(ResetPasswordMailSchema)
    })

    const onSubmit: SubmitHandler<ResetPasswordMailType> = async (data) => {
        const errors = await requestPasswordReset(data.email)

        // Handle API validation errors
        for (let error in errors) {
            return setError(error as keyof ResetPasswordMailType, { message: errors[error].message })
        }

        if (!Object.keys(errors).length) {
            setSuccessMessage(`لقد قمت بإرسال طلب تغيير كلمة السر بنجاح. تم إرسال تعليمات لبريدك الإلكتروني ${data.email} تحتوي كيفية تغيير كلمة السر.`)
        }
    }

    if (successMessage) {
        return (
            <div className="bg-card m-auto h-fit rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
                <div className="p-8 pt-4 pb-6 md:w-[500px] w-[350px] sm:w-[450px] text-center">
                    <h1 className="mb-4 text-xl text-primary font-semibold">تم إرسال الطلب</h1>
                    <p className="text-md text-foreground">{successMessage}</p>
                    <Button
                        asChild
                        className="mt-6"
                        variant="secondary"
                    >
                        <Link href="/auth/login">العودة لتسجيل الدخول</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-card m-auto h-fit rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
            <div className="p-8 pt-2 pb-6 md:w-[500px] w-[350px] sm:w-[450px]">
                <div>
                    <h1 className="mb-1 mt-4 text-xl text-center text-primary font-semibold">تغيير كلمة السر</h1>
                </div>
                <p className="text-accent-foreground text-center text-sm">
                    هل أنت تائه؟
                    <Button
                        asChild
                        variant="link"
                        className="px-1">
                        <Link href="/auth/login">تسجيل الدخول </Link>
                    </Button>
                    أو
                    <Button
                        asChild
                        variant="link"
                        className="px-1">
                        <Link href="/auth/login">أنشىء حسابك</Link>
                    </Button>
                </p>
                <div id="root-error" aria-live="polite" aria-atomic="true" className='text-center'>
                    {errors?.root &&
                        <p className="mt-2 text-sm text-red-500" role="alert">
                            {errors?.root.message}
                        </p>
                    }
                </div>
                <hr className="my-4 border-dashed" />

                <div className="space-y-6 ">
                    <div className="space-y-2">
                        <Label
                            htmlFor="email"
                            className="block text-md">
                            البريد الإلكتروني
                        </Label>
                        <Input
                            {...register("email")}
                            type="text"
                            name="email"
                            id="email"
                            aria-invalid={errors.email ? "true" : "false"}
                        />

                        <div id="email-error" aria-live="polite" aria-atomic="true">
                            {errors?.email &&
                                <p className="mt-2 text-sm text-red-500" role="alert">
                                    {errors.email.message}
                                </p>
                            }
                        </div>
                    </div>
                    <Button className="w-full cursor-pointer text-md" type="submit" disabled={isSubmitting}>
                        تغير كلمة المرور
                    </Button>
                </div>
            </div>
        </form>
    )
}