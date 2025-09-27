'use client'

import { useState } from 'react';
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginType } from '@mukhtasar/shared'
import { SubmitHandler, useForm } from "react-hook-form"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { login } from '@/features/auth/service/auth'
import { Eye, EyeClosed } from 'lucide-react';

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginType>({
        resolver: zodResolver(LoginSchema)
    })

    const onSubmit: SubmitHandler<LoginType> = async (data) => {
        const errors = await login(data);

        // Displaying the server errors
        for (let error in errors) {
            return setError(error as keyof LoginType, { message: errors[error].message })
        }

        window.location.href = "/dashboard/urls"
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="p-8 pt-2 pb-6 md:w-[500px] w-[85vw] sm:w-[450px]">

                <div id="root-error" aria-live="polite" aria-atomic="true" className='text-center'>
                    {errors?.root &&
                        <p className="mt-2 text-sm text-red-500" role="alert">
                            {errors?.root.message}
                        </p>
                    }
                </div>
                <div className="space-y-6 ">
                    <div className="space-y-2">
                        <Label
                            htmlFor="email"
                            className="block text-md">
                            البريد الإلكتروني
                        </Label>
                        <Input
                            {...register("email")}
                            className='focus-visible:border-blue-600 focus-visible:ring-0 focus-visible:border-2'
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

                    <div className="space-y-0.5 mb-5">
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="password"
                                className="text-md">
                                كلمة السر
                            </Label>
                        </div>
                        <div className="relative">
                            <Input
                                {...register("password")}
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                className="input sz-md variant-mixed pr-8 focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2"
                                aria-invalid={errors.password ? "true" : "false"}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowPassword(prev => !prev)}
                                tabIndex={-1}
                            >
                                {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                            </button>
                        </div>

                        <div id="password-error" aria-live="polite" aria-atomic="true">
                            {errors?.password &&
                                <p className="mt-2 text-sm text-red-500" role="alert">
                                    {errors.password.message}
                                </p>
                            }
                        </div>
                    </div>
                    <Button
                        asChild
                        variant="link"
                        className="px-2 pt-0 pb-0">
                        <Link href="/auth/reset-password">هل نسيت كلمة السر؟</Link>
                    </Button>
                    <Button className="w-full cursor-pointer text-md" type="submit" disabled={isSubmitting}>
                        تسجيل الدخول
                    </Button>
                </div>
            </div>

            <div className="bg-muted rounded-(--radius) border p-3">
                <p className="text-accent-foreground text-center text-sm">
                    ليس لديك حساب على مُختصَر؟
                    <Button
                        asChild
                        variant="link"
                        className="px-2">
                        <Link href="/auth/signup">أنشئ حسابك المجاني</Link>
                    </Button>
                </p>
            </div>
        </form>
    )
}