'use client'

import { useEffect } from "react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { ShortUrlSchema, ShortUrlType } from "@mukhtasar/shared"
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, AlertCircleIcon, CheckCircle, Copy } from "lucide-react";

import { Input } from "@/shared/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Alert, AlertTitle } from "@/shared/components/ui/alert";
import { openToaster } from "@/shared/components/ui/sonner";

import { useCreateUrl } from "@/features/url/hooks/urls-query";

export default function LandingUrlCreationForm() {
    const form = useForm<ShortUrlType>({
        resolver: zodResolver(ShortUrlSchema),
        defaultValues: {
            domain: "mukhtasar.pro",
            alias: "",
            original_url: "",
            description: "",
        }
    })

    const { mutateAsync, data, isSuccess, isError, error } = useCreateUrl()

    const onSubmit: SubmitHandler<ShortUrlType> = async (data) => {
        await mutateAsync(data)
    }

    useEffect(() => {
        if (isError) {
            openToaster(error?.message as string, "error")
        }

        if (isSuccess) {
            openToaster("تم إنشاء الرابط بنجاح.", "success")
            form.reset()
        }
    }, [isError, isSuccess, form, error])

    const handleCopy = async () => {
        await navigator.clipboard.writeText(data?.short_url || "")
        openToaster("تم نسخ الرابط إلى حافظتك بنجاح.", "success")
    }

    return (
        <>
            <div id="root-error" aria-live="polite" aria-atomic="true" className='text-center'>
                {form.formState.errors?.root &&
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircleIcon />
                        <AlertTitle> {form.formState.errors.root?.message}</AlertTitle>
                    </Alert>
                }
            </div>
            {/* Success result */}
            {
                data && (
                    <section className="flex flex-col justify-between items-center">
                        <Button
                            asChild
                            className="inline-flex cursor-pointer mb-6 items-center px-10 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                        >
                            <Link
                                href="/auth/signup"
                            >
                                اشترك حالاً وأجعل الرابط ملكك
                            </Link>
                        </Button>
                        <div className="bg-primary-foreground border mb-5 border-green-200 p-6 rounded-lg sm:w-[70vw] xl:w-[38vw] w-[80vw]">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-accent-foreground" />
                                <h3 className="text-lg font-semibold text-primary">تم إنشاء الرابط بنجاح!</h3>
                            </div>
                            <div className="flex items-center gap-2 mb-4 mt-2">
                                <AlertCircle className="h-4 w-4 text-amber-600" />
                                <h4 className="text-sm font-semibold text-amber-800">هذا رابط مؤقت للتجربة.</h4>
                                <p className="text-sm text-accent-foreground">
                                    <Link href="/auth/signup" className="underline font-medium">أنشئ حساباً مجانياً</Link>
                                    {" "}للحصول على روابط دائمة.
                                </p>
                            </div>


                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">الرابط المختصر:</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Input
                                            value={data.short_url}
                                            readOnly
                                            className="bg-white border-gray-400 rounded-lg focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={async () => await handleCopy()}
                                            className="flex items-center gap-1 cursor-pointer"
                                        >
                                            <Copy className="h-4 w-4" />
                                            نسخ
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )
            }
            <div className="w-fit m-auto">
                {!data &&
                    <p className="pb-4 text-xl text-right mt-4">
                        جرب مُختصِر هنا:
                    </p>
                }
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="relative bg-white p-6 border-2 sm:w-[70vw] xl:w-[45vw] w-[80vw] rounded-xl">
                        <div className="pb-2">
                            <FormField control={form.control} name="original_url" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="pb-1 text-lg">ادخل رابطك الطويل</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="text-end h-[45px] rounded-md border-gray-400 focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2" placeholder="http://example.com/very-long-url" />
                                    </FormControl>
                                    <div className="min-h-[20px]" >
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}>
                            </FormField>
                        </div>

                        <div>
                            <p className="pb-3 text-lg">خصص رابطك</p>
                            <div className="flex items-center sm:gap-4  w-full sm:flex-row flex-col">
                                <div className="w-full">
                                    <FormField control={form.control} name="alias" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-muted-foreground pb-2">الاسم المستعار (اختياري)</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="text-end w-full rounded-md border-gray-400 focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2" placeholder="products" />
                                            </FormControl>
                                            <div className="min-h-[20px]" >
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}>
                                    </FormField>
                                </div>

                                <div className="w-full">
                                    <FormField control={form.control} name="domain" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-muted-foreground pb-2">النطاق</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl className="">
                                                    <SelectTrigger className="w-full rounded-md border-gray-400 focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2">
                                                        <SelectValue placeholder="mukhtasar.pro" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent >
                                                    <SelectItem value="mukhtasar.pro">mukhtasar.pro</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <div className="min-h-[20px]" >
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}>
                                    </FormField>
                                </div>
                            </div>
                        </div>
                        <Button
                            className="inline-flex w-full cursor-pointer items-center px-12 py-5 bg-gradient-to-r
                         from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                            type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "جاري الإنشاء..." : "قصر رابطك مجاناً"}
                        </Button>
                    </form>
                </Form>

            </div >
        </>
    )
}