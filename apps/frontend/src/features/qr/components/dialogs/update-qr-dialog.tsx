// apps/frontend/src/features/qr/components/update-qr-dialog.tsx
'use client'

import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import QRCode from "qrcode"
import { Upload, Download, X } from "lucide-react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Button } from "@/shared/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Slider } from "@/shared/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { openToaster } from "@/shared/components/ui/sonner"

import { useUpdateQrCode } from "@/features/qr/hooks/qr-query"
import { QrCodeType, CreateQrCodeType } from "@/features/qr/types"

const UpdateQrSchema = z.object({
    destination_url: z.string().url("يرجى إدخال رابط صحيح"),
    foreground_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "لون غير صحيح"),
    background_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "لون غير صحيح"),
    shape: z.enum(['square', 'circle', 'rounded', 'dots']),
    size: z.number().min(100).max(1000),
    margin: z.number().min(0).max(20),
    error_correction: z.enum(['L', 'M', 'Q', 'H']),
})

type UpdateQrDialogProps = {
    children: React.ReactNode
    currentQr: QrCodeType
}

export default function UpdateQrDialog({ children, currentQr }: UpdateQrDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("")
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string>("")
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<CreateQrCodeType>({
        resolver: zodResolver(UpdateQrSchema),
        defaultValues: {
            destination_url: currentQr.destination_url,
            foreground_color: currentQr.foreground_color,
            background_color: currentQr.background_color,
            shape: currentQr.shape,
            size: currentQr.size,
            margin: currentQr.margin,
            error_correction: currentQr.error_correction,
        },
    })

    const { mutateAsync, isError, isSuccess, error } = useUpdateQrCode()

    const generateQrCode = async () => {
        const values = form.getValues()
        if (!values.destination_url) return

        try {
            const canvas = canvasRef.current
            if (!canvas) return

            const ctx = canvas.getContext('2d')
            if (!ctx) return

            // Generate QR code
            await QRCode.toCanvas(canvas, values.destination_url, {
                width: values.size,
                margin: values.margin,
                color: {
                    dark: values.foreground_color,
                    light: values.background_color,
                },
                errorCorrectionLevel: values.error_correction,
            })

            // Apply shape modifications
            if (values.shape !== 'square') {
                applyShape(ctx, values.size!, values.shape!)
            }

            // Add logo if provided
            if (logoFile && logoPreview) {
                await addLogoToCanvas(ctx, logoPreview, values.size!)
            } else if (currentQr.logo && !logoFile) {
                // Keep existing logo if no new logo uploaded
                await addLogoToCanvas(ctx, currentQr.logo, values.size!)
            }

            const dataUrl = canvas.toDataURL()
            setQrCodeDataUrl(dataUrl)
        } catch (error) {
            console.error('Error generating QR code:', error)
        }
    }

    const applyShape = (ctx: CanvasRenderingContext2D, size: number, shape: string) => {
        ctx.globalCompositeOperation = 'destination-in'
        ctx.beginPath()

        switch (shape) {
            case 'circle':
                ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
                break
            case 'rounded':
                const radius = size * 0.1
                roundRect(ctx, 0, 0, size, size, radius)
                break
            case 'dots':
                // For dots, we'd need more complex logic - for now, use rounded
                const dotRadius = size * 0.05
                roundRect(ctx, 0, 0, size, size, dotRadius)
                break
        }

        ctx.fill()
        ctx.globalCompositeOperation = 'source-over'
    }

    const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + width - radius, y)
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
        ctx.lineTo(x + width, y + height - radius)
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
        ctx.lineTo(x + radius, y + height)
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
        ctx.closePath()
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
        link.download = `qr-code-updated-${currentQr.id}.png`
        link.href = qrCodeDataUrl
        link.click()
    }

    const onSubmit = async (data: CreateQrCodeType) => {
        if (!currentQr.id) return

        await mutateAsync({ id: currentQr.id, data })
        setIsOpen(false)
        setQrCodeDataUrl("")
        setLogoFile(null)
        setLogoPreview("")
    }

    const handleDialogClose = () => {
        setIsOpen(false)
        setQrCodeDataUrl("")
        setLogoFile(null)
        setLogoPreview("")
        // Reset form to current values
        form.reset({
            destination_url: currentQr.destination_url,
            foreground_color: currentQr.foreground_color,
            background_color: currentQr.background_color,
            shape: currentQr.shape,
            size: currentQr.size,
            margin: currentQr.margin,
            error_correction: currentQr.error_correction,
        })
    }

    useEffect(() => {
        if (isError) {
            openToaster(error?.message as string, "error")
        }

        if (isSuccess) {
            openToaster("تم تعديل كود QR بنجاح.", "success")
        }
    }, [isError, isSuccess, error])

    // Generate QR code when form values change
    useEffect(() => {
        const subscription = form.watch(() => {
            generateQrCode()
        })
        return () => subscription.unsubscribe()
    }, [form, logoFile, logoPreview])

    // Initialize logo preview if current QR has logo
    useEffect(() => {
        if (currentQr.logo && !logoPreview && !logoFile) {
            setLogoPreview(currentQr.logo)
        }
    }, [currentQr.logo, logoPreview, logoFile])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl pt-10 max-h-[90vh] overflow-y-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader className="pb-4">
                            <DialogTitle className="text-right">تعديل كود QR</DialogTitle>
                            <DialogDescription className="text-right">
                                قم بتعديل إعدادات كود QR وشاهد المعاينة المباشرة
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
                                            {logoPreview ? 'تغيير الشعار' : 'رفع شعار'}
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
                                        <img src={logoPreview} alt="Logo preview" className="h-16 w-16 object-contain border rounded" />
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
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Shape */}
                                <FormField
                                    control={form.control}
                                    name="shape"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الشكل</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="square">مربع</SelectItem>
                                                    <SelectItem value="circle">دائرة</SelectItem>
                                                    <SelectItem value="rounded">مربع بزوايا مدورة</SelectItem>
                                                    <SelectItem value="dots">نقاط</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Size */}
                                <FormField
                                    control={form.control}
                                    name="size"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الحجم: {field.value}px</FormLabel>
                                            <FormControl>
                                                <Slider
                                                    min={100}
                                                    max={500}
                                                    step={10}
                                                    value={[field.value!]}
                                                    onValueChange={(value) => field.onChange(value[0])}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Margin */}
                                <FormField
                                    control={form.control}
                                    name="margin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الهامش: {field.value}</FormLabel>
                                            <FormControl>
                                                <Slider
                                                    min={0}
                                                    max={10}
                                                    step={1}
                                                    value={[field.value!]}
                                                    onValueChange={(value) => field.onChange(value[0])}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Error Correction */}
                                <FormField
                                    control={form.control}
                                    name="error_correction"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>مستوى تصحيح الخطأ</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="L">منخفض (~7%)</SelectItem>
                                                    <SelectItem value="M">متوسط (~15%)</SelectItem>
                                                    <SelectItem value="Q">عالي (~25%)</SelectItem>
                                                    <SelectItem value="H">عالي جداً (~30%)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Right side - QR Code Preview */}
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                                    <canvas
                                        ref={canvasRef}
                                        className="max-w-full h-auto"
                                        style={{ display: qrCodeDataUrl ? 'block' : 'none' }}
                                    />
                                    {!qrCodeDataUrl && currentQr.qr_code_url && (
                                        <img
                                            src={currentQr.qr_code_url}
                                            alt="Current QR Code"
                                            className="max-w-full h-auto"
                                        />
                                    )}
                                    {!qrCodeDataUrl && !currentQr.qr_code_url && (
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
                                {form.formState.isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}