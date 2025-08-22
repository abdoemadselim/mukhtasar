import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function ForgotPasswordForm() {
    return (
        <form
            action=""
            className="bg-card m-auto h-fit rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
            <div className="p-8 pt-2 pb-6 md:w-[500px] w-[300px] sm:w-[400px]">

                <h1 className="mb-1 mt-4 text-xl text-center text-primary font-semibold">تغير كلمة السر</h1>

                <hr className="my-4 border-dashed" />

                <div className="mt-6 space-y-6">
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
                            placeholder="name@example.com"
                        />
                    </div>

                    <Button className="w-full text-md cursor-pointer">غير كلمة السر</Button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-muted-foreground text-sm">سنرسل إليك بريداً لتغير كلمة مرورك.</p>
                </div>
            </div>

            <div className="p-3">
                <p className="text-accent-foreground text-center text-sm">
                    تتذكر كلمة المرور؟
                    <Button
                        asChild
                        variant="link"
                        className="px-2">
                        <Link href="/login">تسجيل الدخول</Link>
                    </Button>
                </p>
            </div>
        </form>
    )
}
