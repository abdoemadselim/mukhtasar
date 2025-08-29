import Link from 'next/link'

import Navbar from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div>
      <Navbar />
      <main className='flex min-h-[80vh] flex-col justify-center items-center text-primary'>
        <h1 className='text-9xl text-center'>404</h1>
        <p className='text-center text-lg font-medium'>لم يتم العثور على الصفحة</p>
        <Button asChild className="bg-primary px-6 sm:py-5 text-white mt-8">
          <Link className="sm:text-lg" href="/">الصفحة الرئيسية</Link>
        </Button>
      </main>
    </div>
  )
}