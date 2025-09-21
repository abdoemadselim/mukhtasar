'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { ShortUrlSchema, ShortUrlType } from "@mukhtasar/shared"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { openToaster } from "@/components/ui/sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useCreateUrl } from "@/features/url/hooks/urls-query"
import { useGetActiveDomains } from "@/features/domain/hooks/domain-query"
import { DomainType } from "@/features/domain/types"

export default function CreateUrlDialog({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const form = useForm<ShortUrlType>({
        resolver: zodResolver(ShortUrlSchema),
        defaultValues: {
            original_url: "",
            alias: "",
            domain: "mukhtasar.pro",
            description: "",
        },
    })

    const { data: activeDomains, isError: isActiveDomainsError, error: activeDomainsError } = useGetActiveDomains();

    const { mutateAsync, isError, isSuccess, error } = useCreateUrl()

    const onSubmit = async (data: ShortUrlType) => {
        await mutateAsync(data)

        setIsOpen(false)
        form.reset()
    }

    useEffect(() => {
        if (isError || isActiveDomainsError) {
            openToaster(error?.message as string || activeDomainsError?.message as string, "error")
        }

        if (isSuccess) {
            openToaster("تم إنشاء الرابط بنجاح.", "success")
        }
    }, [isError, activeDomainsError, isActiveDomainsError, isSuccess, error])

    const handleDialogClose = () => {
        setIsOpen(false);
        form.reset();
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] pt-10">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader className="pb-2">
                            <DialogTitle className="text-right">إنشاء رابط مختصر</DialogTitle>
                            <DialogDescription className="text-right">
                                أدخل الرابط الأصلي وقم بتخصيص بيانات الرابط المختصر إذا رغبت.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-8 pb-6 pt-6">
                            {/* Original URL (required) */}
                            <div className="grid w-full gap-2">
                                <FormField
                                    control={form.control}
                                    name="original_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الرابط الأصلي</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="original_url"
                                                    placeholder="https://example.com/page"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Optional description */}
                            <div className="grid w-full gap-2">
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الوصف (اختياري)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    id="description"
                                                    placeholder="أدخل وصفاً للرابط"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Optional alias */}
                            <div className="grid w-full gap-2">
                                <FormField
                                    control={form.control}
                                    name="alias"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الاسم المستعار (اختياري).</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    id="alias"
                                                    placeholder="my-link"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* domain */}
                            <div className="grid w-full gap-2">
                                <FormField
                                    control={form.control}
                                    name="domain"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>النطاق</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="sm:w-[200px] w-full border-gray-300">
                                                        <SelectValue placeholder="اختر نطاق" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {/* Always include your default domain as first option */}
                                                    <SelectItem value="mukhtasar.pro">
                                                        mukhtasar.pro (افتراضي)
                                                    </SelectItem>

                                                    {activeDomains.domains.map((domain: DomainType) => (
                                                        <SelectItem key={domain.id} value={domain.domain}>{domain.domain}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter className="sm:justify-start pt-4">
                            <DialogClose asChild>
                                <Button variant="outline" className="cursor-pointer" onClick={handleDialogClose}>إلغاء</Button>
                            </DialogClose>
                            <Button type="submit" className="cursor-pointer" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "جاري الإنشاء..." : "إنشاء الرابط"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}
