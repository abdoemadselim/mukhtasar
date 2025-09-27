'use client'

import { useState } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewUserSchema, NewUserType } from '@mukhtasar/shared'
import { SubmitHandler, useForm } from "react-hook-form"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { signup } from '@/features/auth/service/auth'
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon, Eye, EyeClosed } from 'lucide-react';

export default function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const router = useRouter()
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<NewUserType>({
        resolver: zodResolver(NewUserSchema)
    })

    const onSubmit: SubmitHandler<NewUserType> = async (data) => {
        const errors = await signup(data);

        // Displaying the server errors
        for (let error in errors) {
            return setError(error as keyof NewUserType, { message: errors[error].message })
        }

        // If everything is ok, redirect to the verification page
        router.replace("/auth/verification")
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-8 pt-2 pb-6 md:w-[500px] w-[85vw] sm:w-[450px]">
                <div id="root-error" aria-live="polite" aria-atomic="true" className='text-center'>
                    {errors?.root &&
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircleIcon />
                            <AlertTitle> {errors.root?.message}</AlertTitle>
                        </Alert>
                    }
                </div>

                <div className="space-y-6 ">
                    <div className="space-y-2">
                        <Label
                            htmlFor="name"
                            className="block text-md">
                            الإسم الكامل
                        </Label>
                        <Input
                            {...register("name")}
                            className='focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2'
                            type="text"
                            name="name"
                            id="name"
                            aria-invalid={errors.name ? "true" : "false"}
                        />

                        <div id="name-error" aria-live="polite" aria-atomic="true">
                            {errors?.name &&
                                <p className="mt-2 text-sm text-red-500" role="alert">
                                    {errors?.name.message}
                                </p>
                            }
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="email"
                            className="block text-md">
                            البريد الإلكتروني
                        </Label>
                        <Input
                            {...register("email")}
                            className='focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2'
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

                    <div className="space-y-0.5">
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

                    <div className="space-y-0.5">
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="password-confirmation"
                                className="text-md">
                                تأكيد كلمة السر
                            </Label>
                        </div>
                        <div className="relative">
                            <Input
                                {...register("password_confirmation")}
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                id="password_confirmation"
                                className="input sz-md variant-mixed pr-8 focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2"
                                disabled={isSubmitting}
                                aria-invalid={errors.password_confirmation ? "true" : "false"}
                            />

                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                            </button>
                        </div>

                        <div aria-live="polite" aria-atomic="true">
                            {errors?.password_confirmation &&
                                <p className="mt-2 text-sm text-red-500" role="alert">
                                    {errors.password_confirmation.message}
                                </p>
                            }
                        </div>
                    </div>

                    <Button className="w-full cursor-pointer mt-4 text-md" type="submit" disabled={isSubmitting}>سجل الاَن</Button>
                </div>
            </div>

            <div className="bg-muted rounded-(--radius) border p-3">
                <p className="text-accent-foreground text-center text-sm">
                    هل لديك حساب على مُختصِر؟
                    <Button
                        asChild
                        variant="link"
                        className="px-2">
                        <Link href="/auth/login">تسجيل الدخول</Link>
                    </Button>
                </p>
            </div>
        </form>
    )
}