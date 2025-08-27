'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { ShortUrlSchema, ShortUrlType } from "@mukhtasar/shared"
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, AlertCircleIcon, CheckCircle, Copy } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { openToaster } from "@/components/ui/sonner";

import { useAuth } from "@/features/auth/context/auth-context";
import { useUrl } from "@/features/url/context/urls-context";
import { createUrl } from "@/features/url/service/urls-service";

export default function LandingUrlCreationForm() {
    const { user } = useAuth();
    const { canCreateUrl, incrementUrlCount } = useUrl();
    type UrlOutput = ShortUrlType & {
        short_url: string
    }

    const [createdUrl, setCreatedUrl] = useState<UrlOutput | null>(null);
    const form = useForm<ShortUrlType>({
        resolver: zodResolver(ShortUrlSchema),
        defaultValues: {
            domain: "localhost.com",
            alias: "",
            original_url: ""
        }
    })

    const onSubmit: SubmitHandler<ShortUrlType> = async (data) => {
        // Check guest user limits
        if (!user && !canCreateUrl) {
            form.setError("root", { message: "لقد وصلت الحد الأقصى من الروابط المسموحة.." });
            return;
        }

        setCreatedUrl(null);

        const result = await createUrl(data);

        if (result.data) {
            setCreatedUrl(result.data);

            // Increment URL count for guest users
            if (!user) {
                incrementUrlCount();
            }
            // Reset form
        } else {
            // Displaying the server errors
            for (let error in result) {
                form.setError(error as keyof ShortUrlType || "root", { message: result[error].message })
            }
        }
    }

    useEffect(() => {
        if (form.formState.isSubmitSuccessful) {
            form.reset();
        }
    }, [form, form.reset]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(createdUrl?.short_url || "")
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
                createdUrl && (
                    <div className="bg-primary-foreground border mb-5 border-green-200 p-6 rounded-lg sm:w-[70vw] xl:w-[38vw] w-[80vw]">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="h-5 w-5 text-accent-foreground" />
                            <h3 className="text-lg font-semibold text-primary">تم إنشاء الرابط بنجاح!</h3>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-700">الرابط المختصر:</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Input
                                        value={createdUrl.short_url}
                                        readOnly
                                        className="bg-white"
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
                )}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="relative bg-white p-6 border-2 sm:w-[70vw] xl:w-[38vw] w-[80vw] rounded-lg">
                    <div className="pb-8">
                        <FormField control={form.control} name="original_url" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="pb-3 text-lg">ادخل رابطك الطويل هنا</FormLabel>
                                <FormControl>
                                    <Input {...field} className="text-end h-[45px] border-gray-300" placeholder="http://example.com/very-long-url" />
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
                        <div className="flex items-center gap-4 md:w-[80%] w-full">
                            <div className="w-full">
                                <FormField control={form.control} name="alias" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-muted-foreground pb-3">الاسم المستعار (اختياري)</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="text-end border-gray-300 w-full" placeholder="products" />
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
                                        <FormLabel className="text-muted-foreground pb-3">النطاق</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full border-gray-300">
                                                    <SelectValue placeholder="localhost.com" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="localhost.com">localhost.com</SelectItem>
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

                    {/* Guest user limit warning */}
                    {!user && !canCreateUrl && (
                        <div className="mt-4">
                            <Alert className="border-amber-200 bg-amber-50">
                                <AlertCircle className="h-4 w-4 text-amber-600" />
                                <AlertDescription className="text-amber-800">
                                    كزائر، يمكنك إنشاء {5 - (form.formState.isSubmitting ? 0 : 0)} روابط مجانية.
                                    <div className="flex gap-2 items-center">
                                        <Link href="/signup" className="underline font-medium mr-1">أنشئ حساباً</Link>
                                        لإنشاء روابط أكثر
                                    </div>
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <Button className="mt-15 cursor-pointer w-full text-2xl py-4 h-12" type="submit" disabled={(!user && !canCreateUrl) || form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "جاري الإنشاء..." : "قصر رابطك مجاناً"}
                    </Button>
                </form>
            </Form>
        </>
    )
}