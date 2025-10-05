'use client'

import { useRef } from "react"
import { Upload, X } from "lucide-react"
import Image from "next/image"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"

interface UrlAndLogoSectionProps {
    control: any
    stepNumber: number
    resetFieldValue: (field: string) => void
}

export default function UrlAndLogoSection({
    control,
    stepNumber,
    resetFieldValue
}: UrlAndLogoSectionProps) {
    // Why ref? because we we want when user clicks on the button element to trigger the file upload input
    const fileInputRef = useRef<HTMLInputElement>(null)

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
                                    {field.value && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                field.onChange(undefined);
                                                resetFieldValue("logo")
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
                                {field.value && (
                                    <Image
                                        src={field.value ? URL.createObjectURL(field.value) : ""}
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
}
