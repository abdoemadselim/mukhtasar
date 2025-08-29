'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewUserSchema, NewUserType } from '@mukhtasar/shared'
import { SubmitHandler, useForm } from "react-hook-form"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { signup } from '@/features/auth/service/auth'
import { useAuth } from '@/features/auth/context/auth-context';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

export default function SignUpForm() {
    const { checkAuth } = useAuth()
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
        await checkAuth()
        router.replace("/auth/verification")
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-card m-auto h-fit rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
            <div className="p-8 pt-2 pb-6 md:w-[500px] w-[350px] sm:w-[450px]">
                <div>
                    <h1 className="mb-1 mt-4 text-xl text-center text-primary font-semibold">أنشىء حسابك المجاني</h1>
                </div>
                <div id="root-error" aria-live="polite" aria-atomic="true" className='text-center'>
                    {errors?.root &&
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircleIcon />
                            <AlertTitle> {errors.root?.message}</AlertTitle>
                        </Alert>
                    }
                </div>
                <hr className="my-4 border-dashed" />

                <div className="space-y-6 ">
                    <div className="space-y-2">
                        <Label
                            htmlFor="name"
                            className="block text-md">
                            الإسم الكامل
                        </Label>
                        <Input
                            {...register("name")}
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