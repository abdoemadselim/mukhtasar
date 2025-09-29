'use client'

import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import QRCode from "qrcode"
import { Upload, Download, X } from "lucide-react"
import { CreateQrSchema, QrType } from "@mukhtasar/shared"

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
import { Label } from "@/components/ui/label"
import { openToaster } from "@/components/ui/sonner"

import { useCreateQrCode } from "@/features/qr/hooks/qr-query"
import Image from "next/image.js"

export default function CreateQrDialog({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("")
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string>("")
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<QrType>({
        resolver: zodResolver(CreateQrSchema),
        defaultValues: {
            destination_url: "",
            foreground_color: "#000000",
            background_color: "#ffffff",
        }
    })

    const { mutateAsync, isError, isSuccess, error } = useCreateQrCode()

    const generateQrCode = async () => {
        const values = form.getValues()
        if (!values.destination_url) return

        try {
            const canvas = canvasRef.current
            if (!canvas) return

            const ctx = canvas.getContext('2d')
            if (!ctx) return

            const qrSize = 720 // fixed size
            const errorCorrection = logoFile ? 'L' : 'M' // auto-set

            // Generate QR code
            await QRCode.toCanvas(canvas, values.destination_url, {
                width: qrSize,
                margin: 4, // fixed margin
                color: {
                    dark: values.foreground_color,
                    light: values.background_color,
                },
                errorCorrectionLevel: errorCorrection,
            })

            // Add logo if provided
            if (logoFile && logoPreview) {
                await addLogoToCanvas(ctx, logoPreview, qrSize)
            }

            const dataUrl = canvas.toDataURL()
            setQrCodeDataUrl(dataUrl)
        } catch (error) {
            console.error('Error generating QR code:', error)
        }
    }

    const addLogoToCanvas = async (ctx: CanvasRenderingContext2D, logoSrc: string, canvasSize: number) => {
        return new Promise<void>((resolve) => {
            const img = new Image()
            img.onload = () => {
                const logoSize = canvasSize * 0.2 // Logo is 20% of QR code size
                const x = (canvasSize - logoSize) / 2
                const y = (canvasSize - logoSize) / 2

                // Draw white background for logo
                ctx.fillStyle = '#ffffff'
                ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10)

                ctx.drawImage(img, x, y, logoSize, logoSize)
                resolve()
            }
            img.src = logoSrc
        })
    }

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                openToaster("حجم الملف يجب أن يكون أقل من 2 ميجابايت", "error")
                return
            }

            setLogoFile(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeLogo = () => {
        setLogoFile(null)
        setLogoPreview("")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const downloadQrCode = () => {
        if (!qrCodeDataUrl) return

        const link = document.createElement('a')
        link.download = 'qrcode.png'
        link.href = qrCodeDataUrl
        link.click()
    }

    const onSubmit = async (data: QrType) => {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value.toString())
        })

        if (logoFile) {
            formData.append('logo', logoFile)
        }

        await mutateAsync(data as QrType)
        setIsOpen(false)
        form.reset()
        setQrCodeDataUrl("")
        setLogoFile(null)
        setLogoPreview("")
    }

    const handleDialogClose = () => {
        setIsOpen(false)
        form.reset()
        setQrCodeDataUrl("")
        setLogoFile(null)
        setLogoPreview("")
    }

    useEffect(() => {
        if (isError) {
            openToaster(error?.message as string, "error")
        }

        if (isSuccess) {
            openToaster("تم إنشاء كود QR بنجاح.", "success")
        }
    }, [isError, isSuccess, error])

    // Generate QR code when form values change
    useEffect(() => {
        const subscription = form.watch(() => {
            generateQrCode()
        })
        return () => subscription.unsubscribe()
    }, [form, logoFile, logoPreview])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl pt-10 max-h-[90vh] overflow-y-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader className="pb-4">
                            <DialogTitle className="text-right">إنشاء كود QR مخصص</DialogTitle>
                            <DialogDescription className="text-right">
                                أدخل الرابط وقم بتخصيص شكل ولون كود QR الخاص بك
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                            {/* Left side - Form controls */}
                            <div className="space-y-6">
                                {/* Destination URL */}
                                <FormField
                                    control={form.control}
                                    name="destination_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الرابط الوجهة</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2"
                                                    placeholder="https://example.com"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Logo Upload */}
                                <div className="space-y-2">
                                    <Label>الشعار (اختياري)</Label>
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
                                                onClick={removeLogo}
                                                className="cursor-pointer"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="hidden"
                                        />
                                    </div>
                                    {logoPreview && (
                                        <Image src={logoPreview} alt="Logo preview" className="h-16 w-16 object-contain border rounded" width={720} height={720} />
                                    )}
                                </div>

                                {/* Colors */}
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="foreground_color"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>لون المقدمة</FormLabel>
                                                <div className="flex items-center gap-2">
                                                    <FormControl>
                                                        <Input
                                                            type="color"
                                                            {...field}
                                                            className="w-12 h-10 border-2"
                                                        />
                                                    </FormControl>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2"
                                                            placeholder="#000000"
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="background_color"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>لون الخلفية</FormLabel>
                                                <div className="flex items-center gap-2">
                                                    <FormControl>
                                                        <Input
                                                            type="color"
                                                            {...field}
                                                            className="w-12 h-10 border-2"
                                                        />
                                                    </FormControl>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2"
                                                            placeholder="#ffffff"
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Right side - QR Code Preview */}
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                                    <canvas
                                        ref={canvasRef}
                                        className="max-w-full h-auto"
                                        style={{ display: qrCodeDataUrl ? 'block' : 'none' }}
                                    />
                                    {!qrCodeDataUrl && (
                                        <div className="w-64 h-64 flex items-center justify-center text-gray-500">
                                            معاينة كود QR
                                        </div>
                                    )}
                                </div>
                                {qrCodeDataUrl && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={downloadQrCode}
                                        className="cursor-pointer"
                                    >
                                        <Download className="h-4 w-4 ml-2" />
                                        تحميل المعاينة
                                    </Button>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="sm:justify-start pt-4">
                            <DialogClose asChild>
                                <Button variant="outline" className="cursor-pointer" onClick={handleDialogClose}>
                                    إلغاء
                                </Button>
                            </DialogClose>
                            <Button type="submit" className="cursor-pointer" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "جاري الإنشاء..." : "إنشاء كود QR"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}