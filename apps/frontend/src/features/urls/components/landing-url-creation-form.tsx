'use client'

import { SubmitHandler, useForm } from "react-hook-form";
import { ShortUrlSchema, ShortUrlType } from "@mukhtasar/shared"
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";

export default function LandingUrlCreationForm() {
    const form = useForm<ShortUrlType>({
        resolver: zodResolver(ShortUrlSchema)
    })

    const onSubmit: SubmitHandler<ShortUrlType> = async (data) => {
        console.log(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="relative bg-white p-6 border-2 sm:w-[70vw] xl:w-[38vw] w-[80vw] rounded-lg">
                <div className="pb-8">
                    <FormField control={form.control} name="original_url" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="pb-3 text-lg">ادخل رابطك الطويل هنا</FormLabel>
                            <FormControl>
                                <Input {...field} className="text-end h-[45px] border-gray-300" placeholder="http://example.com/very-long-url" />
                            </FormControl>
                            <FormDescription>
                                <div id="original-url-error" aria-live="polite" aria-atomic="true">
                                    {form.formState.errors?.original_url &&
                                        <p className="mt-2 text-sm text-red-500" role="alert">
                                            {form.formState.errors.original_url.message}
                                        </p>
                                    }
                                </div>
                            </FormDescription>
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
                                    <FormDescription>
                                        <div id="alias-error" aria-live="polite" aria-atomic="true" className="min-h-[20px]">
                                            {form.formState.errors?.alias &&
                                                <p className="mt-2 text-sm text-red-500" role="alert">
                                                    {form.formState.errors.alias.message}
                                                </p>
                                            }
                                        </div>
                                    </FormDescription>
                                </FormItem>
                            )}>
                            </FormField>
                        </div>

                        <div className="w-full">
                            <FormField control={form.control} name="domain" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-muted-foreground pb-3">النطاق</FormLabel>
                                    <Select>
                                        <FormControl>
                                            <SelectTrigger id="domain" className="w-full border-gray-300">
                                                <SelectValue placeholder="localhost.com" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="localhost.com">localhost.com</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        <div id="domain-error" aria-live="polite" aria-atomic="true" className="min-h-[20px]">
                                            {form.formState.errors?.domain &&
                                                <p className="mt-2 text-sm text-red-500" role="alert">
                                                    {form.formState.errors.domain.message}
                                                </p>
                                            }
                                        </div>
                                    </FormDescription>
                                </FormItem>
                            )}>
                            </FormField>
                        </div>
                    </div>
                </div>
                <Button className="mt-15 cursor-pointer w-full text-2xl py-4 h-12" type="submit" disabled={form.formState.isSubmitting}>قصر رابطك مجاناً</Button>
            </form>
        </Form>
    )
}