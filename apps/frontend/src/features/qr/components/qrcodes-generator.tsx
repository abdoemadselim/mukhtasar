// apps/frontend/src/features/qr/components/qr-generator-content.tsx
'use client'

import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import QRCode from "qrcode"
import { Upload, Download, X, Save, Palette, Settings2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { openToaster } from "@/components/ui/sonner"

import { useCreateQrCode } from "@/features/qr/hooks/qr-query"
import { CreateQrCodeType } from "@/features/qr/types"

const QrGeneratorSchema = z.object({
    destination_url: z.string().url("يرجى إدخال رابط صحيح"),
    foreground_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "لون غير صحيح"),
    background_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "لون غير صحيح"),
    shape: z.enum(['square', 'circle', 'rounded', 'dots']),
    size: z.number().min(100).max(1000),
    margin: z.number().min(0).max(20),
    error_correction: z.enum(['L', 'M', 'Q', 'H']),
})

const colorPresets = [
    { name: 'أسود/أبيض', fg: '#000000', bg: '#ffffff' },
    { name: 'أزرق/أبيض', fg: '#0066cc', bg: '#ffffff' },
    { name: 'أحمر/أبيض', fg: '#cc0000', bg: '#ffffff' },
    { name: 'أخضر/أبيض', fg: '#00cc66', bg: '#ffffff' },
    { name: 'بنفسجي/أبيض', fg: '#6600cc', bg: '#ffffff' },
    { name: 'أبيض/أسود', fg: '#ffffff', bg: '#000000' },
]

export default function QrGeneratorContent() {
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("")
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string>("")
    const [isSaving, setIsSaving] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<CreateQrCodeType>({
        resolver: zodResolver(QrGeneratorSchema),
        defaultValues: {
            destination_url: "",
            foreground_color: "#000000",
            background_color: "#ffffff",
            shape: "square",
            size: 300,
            margin: 4,
            error_correction: "M",
        },
    })

    const { mutateAsync, isError, isSuccess, error } = useCreateQrCode()

    const generateQrCode = async () => {
        const values = form.getValues()
        if (!values.destination_url) {
            setQrCodeDataUrl("")
            return
        }

        try {
            const canvas = canvasRef.current
            if (!canvas) return

            const ctx = canvas.getContext('2d')
            if (!ctx) return

            // Clear canvas first
            ctx.clearRect(0, 0, canvas.width, canvas.height)

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
                applyShape(ctx, values.size, values.shape)
            }

            // Add logo if provided
            if (logoFile && logoPreview) {
                await addLogoToCanvas(ctx, logoPreview, values.size)
            }

            const dataUrl = canvas.toDataURL('image/png', 1.0)
            setQrCodeDataUrl(dataUrl)
        } catch (error) {
            console.error('Error generating QR code:', error)
            setQrCodeDataUrl("")
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
                // For dots, we'd need more complex logic - for now, use rounded with smaller radius
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

                // Draw white background circle for logo
                ctx.fillStyle = '#ffffff'
                ctx.beginPath()
                ctx.arc(x + logoSize / 2, y + logoSize / 2, logoSize / 2 + 8, 0, 2 * Math.PI)
                ctx.fill()

                // Draw logo
                ctx.drawImage(img, x, y, logoSize, logoSize)
                resolve()
            }
            img.onerror = () => resolve() // Continue even if logo fails to load
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

    const downloadQrCode = (format: 'png' | 'svg' = 'png') => {
        if (!qrCodeDataUrl) return

        const link = document.createElement('a')
        link.download = `qr-code.${format}`
        link.href = qrCodeDataUrl
        link.click()
    }

    const saveQrCode = async () => {
        const data = form.getValues()
        if (!data.destination_url || !qrCodeDataUrl) {
            openToaster("يرجى إدخال رابط صحيح وإنشاء كود QR أولاً", "error")
            return
        }

        setIsSaving(true)
        try {
            await mutateAsync(data)
        } finally {
            setIsSaving(false)
        }
    }

    const applyColorPreset = (preset: typeof colorPresets[0]) => {
        form.setValue('foreground_color', preset.fg)
        form.setValue('background_color', preset.bg)
    }

    useEffect(() => {
        if (isError) {
            openToaster(error?.message as string, "error")
        }

        if (isSuccess) {
            openToaster("تم حفظ كود QR بنجاح في مكتبتك.", "success")
        }
    }, [isError, isSuccess, error])

    // Generate QR code when form values change
    useEffect(() => {
        const subscription = form.watch(() => {
            const timer = setTimeout(() => {
                generateQrCode()
            }, 300) // Debounce for better performance
            return () => clearTimeout(timer)
        })
        return () => subscription.unsubscribe()
    }, [form, logoFile, logoPreview])

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">مولد أكواد QR المتقدم</h1>
                <p className="text-muted-foreground">
                    أنشئ أكواد QR مخصصة بأشكال وألوان مميزة مع معاينة فورية
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Left side - Controls */}
                <div className="space-y-6">
                    <Form {...form}>
                        <form className="space-y-6">
                            {/* URL Input */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Settings2 className="h-5 w-5" />
                                        الإعدادات الأساسية
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="destination_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>الرابط الوجهة *</FormLabel>
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
                                    <div className="space-y-3">
                                        <Label>الشعار (اختياري)</Label>
                                        <div className="flex items-center gap-3">
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
                                            <div className="flex items-center gap-3">
                                                <img src={logoPreview} alt="Logo preview" className="h-12 w-12 object-contain border rounded" />
                                                <div className="text-sm text-muted-foreground">
                                                    سيظهر الشعار في وسط كود QR
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Style Controls */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Palette className="h-5 w-5" />
                                        التخصيص والتصميم
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Tabs defaultValue="colors" className="w-full">
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="colors">الألوان</TabsTrigger>
                                            <TabsTrigger value="shape">الشكل</TabsTrigger>
                                            <TabsTrigger value="advanced">متقدم</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="colors" className="space-y-4 mt-4">
                                            {/* Color Presets */}
                                            <div className="space-y-3">
                                                <Label>الألوان الجاهزة</Label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {colorPresets.map((preset, index) => (
                                                        <Button
                                                            key={index}
                                                            type="button"
                                                            variant="outline"
                                                            className="h-12 cursor-pointer justify-start"
                                                            onClick={() => applyColorPreset(preset)}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex">
                                                                    <div
                                                                        className="w-4 h-4 border border-gray-300"
                                                                        style={{ backgroundColor: preset.fg }}
                                                                    />
                                                                    <div
                                                                        className="w-4 h-4 border border-gray-300"
                                                                        style={{ backgroundColor: preset.bg }}
                                                                    />
                                                                </div>
                                                                <span className="text-sm">{preset.name}</span>
                                                            </div>
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Custom Colors */}
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
                                                                        className="w-12 h-10 border-2 cursor-pointer"
                                                                    />
                                                                </FormControl>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2 font-mono"
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
                                                                        className="w-12 h-10 border-2 cursor-pointer"
                                                                    />
                                                                </FormControl>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:border-2 font-mono"
                                                                    />
                                                                </FormControl>
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="shape" className="space-y-4 mt-4">
                                            <FormField
                                                control={form.control}
                                                name="shape"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>شكل الكود</FormLabel>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {[
                                                                { value: 'square', label: 'مربع', icon: '⬛' },
                                                                { value: 'circle', label: 'دائرة', icon: '⚫' },
                                                                { value: 'rounded', label: 'مدور', icon: '⬜' },
                                                                { value: 'dots', label: 'نقاط', icon: '⚪' },
                                                            ].map((shape) => (
                                                                <Button
                                                                    key={shape.value}
                                                                    type="button"
                                                                    variant={field.value === shape.value ? "default" : "outline"}
                                                                    className="h-16 cursor-pointer flex flex-col"
                                                                    onClick={() => field.onChange(shape.value)}
                                                                >
                                                                    <span className="text-2xl mb-1">{shape.icon}</span>
                                                                    <span className="text-sm">{shape.label}</span>
                                                                </Button>
                                                            ))}
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TabsContent>

                                        <TabsContent value="advanced" className="space-y-4 mt-4">
                                            <FormField
                                                control={form.control}
                                                name="size"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>الحجم: {field.value}px</FormLabel>
                                                        <FormControl>
                                                            <Slider
                                                                min={100}
                                                                max={800}
                                                                step={25}
                                                                value={[field.value]}
                                                                onValueChange={(value) => field.onChange(value[0])}
                                                                className="cursor-pointer"
                                                            />
                                                        </FormControl>
                                                        <div className="flex justify-between text-sm text-muted-foreground">
                                                            <span>100px</span>
                                                            <span>800px</span>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

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
                                                                value={[field.value]}
                                                                onValueChange={(value) => field.onChange(value[0])}
                                                                className="cursor-pointer"
                                                            />
                                                        </FormControl>
                                                        <div className="flex justify-between text-sm text-muted-foreground">
                                                            <span>بلا هامش</span>
                                                            <span>هامش كبير</span>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

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
                                                                <SelectItem value="L">منخفض (~7%) - أسرع</SelectItem>
                                                                <SelectItem value="M">متوسط (~15%) - موصى به</SelectItem>
                                                                <SelectItem value="Q">عالي (~25%) - مقاوم للتلف</SelectItem>
                                                                <SelectItem value="H">عالي جداً (~30%) - أقصى حماية</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </form>
                    </Form>
                </div>

                {/* Right side - Preview */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>معاينة فورية</CardTitle>
                            <CardDescription>
                                شاهد التغييرات على كود QR في الوقت الفعلي
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-center">
                                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                                    <canvas
                                        ref={canvasRef}
                                        className="max-w-full h-auto mx-auto"
                                        style={{ display: qrCodeDataUrl ? 'block' : 'none' }}
                                    />
                                    {!qrCodeDataUrl && (
                                        <div className="w-80 h-80 flex items-center justify-center text-gray-500 bg-white border rounded">
                                            <div className="text-center">
                                                <div className="text-6xl mb-4">📱</div>
                                                <p className="text-lg font-medium">معاينة كود QR</p>
                                                <p className="text-sm mt-2">أدخل رابطاً لرؤية المعاينة</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {qrCodeDataUrl && (
                                <div className="flex justify-center gap-3">
                                    <Button
                                        onClick={() => downloadQrCode('png')}
                                        variant="outline"
                                        className="cursor-pointer"
                                    >
                                        <Download className="h-4 w-4 ml-2" />
                                        تحميل PNG
                                    </Button>
                                    <Button
                                        onClick={saveQrCode}
                                        disabled={isSaving}
                                        className="cursor-pointer"
                                    >
                                        <Save className="h-4 w-4 ml-2" />
                                        {isSaving ? 'جاري الحفظ...' : 'حفظ في المكتبة'}
                                    </Button>
                                </div>
                            )}

                            {/* QR Code Info */}
                            {qrCodeDataUrl && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-900 mb-2">معلومات الكود</h4>
                                    <div className="space-y-2 text-sm text-blue-800">
                                        <div className="flex justify-between">
                                            <span>الحجم:</span>
                                            <Badge variant="outline">{form.watch('size')}px</Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>الشكل:</span>
                                            <Badge variant="outline">
                                                {form.watch('shape') === 'square' ? 'مربع' :
                                                    form.watch('shape') === 'circle' ? 'دائرة' :
                                                        form.watch('shape') === 'rounded' ? 'مدور' : 'نقاط'}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>تصحيح الخطأ:</span>
                                            <Badge variant="outline">{form.watch('error_correction')}</Badge>
                                        </div>
                                        {logoFile && (
                                            <div className="flex justify-between">
                                                <span>الشعار:</span>
                                                <Badge variant="outline">✓ مضاف</Badge>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}