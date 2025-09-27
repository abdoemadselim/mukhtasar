import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function ErrorPage() {
    return (
        <main className='flex min-h-[80vh] flex-col justify-center items-center text-primary px-4'>
            <AlertTriangle className='text-primary mb-6' size={80} />

            <h1 className='sm:text-6xl text-4xl text-center font-bold mb-4'>حدث خطأ ما</h1>

            <p className='text-center text-lg font-medium text-muted-foreground max-w-md mb-8'>
                عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
            </p>

            <div className='flex flex-col sm:flex-row gap-4'>
                <Button asChild className="bg-primary px-6 sm:py-5 text-white">
                    <Link className="sm:text-lg" href="/">الصفحة الرئيسية</Link>
                </Button>

            </div>
        </main>
    )
}