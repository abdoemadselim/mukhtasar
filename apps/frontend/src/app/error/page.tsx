import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface ErrorPageProps {
    title?: string
    message?: string
    showHomeButton?: boolean
    showRetryButton?: boolean
    onRetry?: () => void
    retryText?: string
}

export default function ErrorPage({
    title = "حدث خطأ ما",
    message = "عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
    showHomeButton = true,
    showRetryButton = false,
    onRetry,
    retryText = "المحاولة مرة أخرى"
}: ErrorPageProps) {
    return (
        <div>
            <main className='flex min-h-[80vh] flex-col justify-center items-center text-primary px-4'>
                <AlertTriangle className='text-primary mb-6' size={80} />

                <h1 className='sm:text-6xl text-4xl text-center font-bold mb-4'>{title}</h1>

                <p className='text-center text-lg font-medium text-muted-foreground max-w-md mb-8'>
                    {message}
                </p>

                <div className='flex flex-col sm:flex-row gap-4'>
                    {showRetryButton && onRetry && (
                        <Button
                            onClick={onRetry}
                            variant="outline"
                            className="px-6 sm:py-5 border-primary text-primary hover:bg-primary hover:text-white"
                        >
                            <span className="sm:text-lg">{retryText}</span>
                        </Button>
                    )}

                    {showHomeButton && (
                        <Button asChild className="bg-primary px-6 sm:py-5 text-white">
                            <Link className="sm:text-lg" href="/">الصفحة الرئيسية</Link>
                        </Button>
                    )}
                </div>
            </main>
        </div>
    )
}