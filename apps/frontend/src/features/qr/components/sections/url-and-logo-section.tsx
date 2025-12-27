'use client'

import { memo, useEffect, useRef, useState } from "react"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { useFormContext } from "react-hook-form"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"

const UrlAndLogoSection = memo(function UrlAndLogoSection({ stepNumber }: { stepNumber: number }) {
    // Why ref? because we we want when user clicks on the button element to trigger the file upload input
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { subscribe, control, resetField } = useFormContext()
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    useEffect(() => {
        const callback = subscribe({
            name: ["logo"],
            callback: (data) => {
                if (data.values.logo) {
                    setLogoPreview(URL.createObjectURL(data.values.logo))
                }
            }
        })

        return () => callback()
    }, [subscribe])

    return (
        <section className="space-y-4 bg-white p-4 rounded-lg h-fit relative">
            <span className="bg-primary text-white w-7 h-7 flex items-center justify-center font-bold text-center p-4 rounded-full text-xl absolute top-[-17px] right-[-10px] border-1">
                {stepNumber}
            </span>

            {/* Destination URL */}
            <FormField
                control={control}
                name="destination_url"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-lg">الرابط الوجهة</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                dir="ltr"
                                className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2"
                                placeholder="https://example.com"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Logo Field */}
            <FormField
                control={control}
                name="logo"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-lg">الشعار (اختياري)</FormLabel>
                        <FormControl>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="cursor-pointer"
                                    >
                                        <Upload className="h-4 w-4 ml-2" />
                                        رفع شعار
                                    </Button>
                                    {logoPreview && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                field.onChange(undefined);
                                                resetField("logo")
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = "";
                                                }
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => {
                                            const file = event.target.files?.[0];
                                            if (file) {
                                                field.onChange(file);
                                            }
                                        }}
                                        className="hidden"
                                    />
                                </div>
                                {logoPreview && (
                                    <Image
                                        src={logoPreview}
                                        alt="Logo preview"
                                        width={32}
                                        height={32}
                                        className="h-16 w-16 object-contain border rounded"
                                    />
                                )}
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </section>
    )
})

export default UrlAndLogoSection