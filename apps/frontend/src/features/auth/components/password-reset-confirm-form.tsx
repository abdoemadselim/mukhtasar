'use client'

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetPasswordSchema, ResetPasswordType } from '@mukhtasar/shared'
import { SubmitHandler, useForm } from "react-hook-form"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { resetPassword } from '@/features/auth/service/auth'

export default function PasswordResetConfirmForm({ token }: { token: string }) {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<ResetPasswordType>({
        resolver: zodResolver(ResetPasswordSchema)
    })

    const onSubmit: SubmitHandler<ResetPasswordType> = async (data) => {
        const errors = await resetPassword({ token, ...data });

        // Displaying the server errors
        for (let error in errors) {
            return setError(error as keyof ResetPasswordType, { message: errors[error].message })
        }
    }
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-card m-auto h-fit rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
            <div className="p-8 pt-2 pb-6 md:w-[500px] w-[300px] sm:w-[400px]">

                <h1 className="mb-1 mt-4 text-xl text-center text-primary font-semibold">تغير كلمة السر</h1>
                <div id="root-error" aria-live="polite" aria-atomic="true" className='text-center'>
                    {errors?.root &&
                        <p className="mt-2 text-sm text-red-500" role="alert">
                            {errors?.root.message}
                        </p>
                    }
                </div>
                <hr className="my-4 border-dashed" />

                <div className="mt-6 space-y-6">
                    <div className="space-y-0.5">
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="password"
                                className="text-md">
                                كلمة السر الجديدة
                            </Label>
                        </div>
                        <Input
                            {...register("password")}
                            type="password"
                            name="password"
                            id="password"
                            className="input sz-md variant-mixed"
                            aria-invalid={errors.password ? "true" : "false"}
                        />

                        <div id="password-error" aria-live="polite" aria-atomic="true">
                            {errors?.password &&

                                <p className="mt-2 text-sm text-red-500" role="alert">
                                    {errors.password.message}
                                </p>
                            }
                        </div>
                    </div>

                    <div className="space-y-0.5">
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="password-confirmation"
                                className="text-md">
                                تأكيد كلمة السر
                            </Label>
                        </div>
                        <Input
                            {...register("password_confirmation")}
                            type="password"
                            name="password_confirmation"
                            id="password_confirmation"
                            className="input sz-md variant-mixed"
                            disabled={isSubmitting}
                            aria-invalid={errors.password_confirmation ? "true" : "false"}
                        />

                        <div aria-live="polite" aria-atomic="true">
                            {errors?.password_confirmation &&
                                <p className="mt-2 text-sm text-red-500" role="alert">
                                    {errors.password_confirmation.message}
                                </p>
                            }
                        </div>
                    </div>

                    <Button className="w-full text-md cursor-pointer">غير كلمة السر</Button>
                </div>
            </div>
        </form>
    )
}
