import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function LoginForm() {
    return (
        <form
            action=""
            className="bg-card m-auto h-fit rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
            <div className="p-8 pt-2 pb-6 md:w-[500px] w-[350px] sm:w-[450px]">
                <div>
                    <h1 className="mb-1 mt-4 text-xl text-center text-primary font-semibold">سجل الدخول لحسابك</h1>
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
                            type="email"
                            required
                            name="email"
                            id="email"
                        />
                    </div>

                    <div className="space-y-0.5">
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="pwd"
                                className=" text-md">
                                كلمة السر
                            </Label>
                        </div>
                        <Input
                            type="password"
                            required
                            name="pwd"
                            id="pwd"
                            className="input sz-md variant-mixed"
                        />
                        <Button
                            asChild
                            variant="link"
                            className='px-0 pt-3'
                            size="sm">
                            <Link
                                href="/forget-password"
                                className="link intent-info variant-ghost text-sm">
                                هل نسيت كلمة المرور؟
                            </Link>
                        </Button>
                    </div>

                    <Button className="w-full cursor-pointer mt-4 text-md">تسجيل الدخول</Button>
                </div>
            </div>

            <div className="bg-muted rounded-(--radius) border p-3">
                <p className="text-accent-foreground text-center text-sm">
                    ليس لديك حساب على مُختصِر
                    <Button
                        asChild
                        variant="link"
                        className="px-2">
                        <Link href="/signup">أنشىء حسابك</Link>
                    </Button>
                </p>
            </div>
        </form>
    )
}