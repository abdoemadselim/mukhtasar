"use client"

import { Download, Copy, Share2, Palette, Settings, QrCode, Link2, Eye, Upload, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image.js"


interface QRCodeOptions {
  url: string
  size: number
  errorCorrection: "L" | "M" | "Q" | "H"
  foregroundColor: string
  backgroundColor: string
  logoUrl?: string
  logoSize: number
  cornerStyle: "square" | "rounded" | "extra-rounded"
  dotStyle: "square" | "rounded" | "dots"
  margin: number
}

export default function QRCodeGenerator() {
  return (
    <h1>Qr Codes</h1>
  )
  // const [options, setOptions] = useState<QRCodeOptions>({
  //   url: "https://example.com",
  //   size: 256,
  //   errorCorrection: "M",
  //   foregroundColor: "#000000",
  //   backgroundColor: "#ffffff",
  //   logoSize: 20,
  //   cornerStyle: "square",
  //   dotStyle: "square",
  //   margin: 4,
  // })

  // const [activeTab, setActiveTab] = useState("design")
  // const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("")
  // const canvasRef = useRef<HTMLCanvasElement>(null)
  // const [isGenerating, setIsGenerating] = useState(false)
  // const [logoFile, setLogoFile] = useState<File | null>(null)
  // const [logoPreview, setLogoPreview] = useState<string>("")
  // const fileInputRef = useRef<HTMLInputElement>(null)

  // const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   if (file && file.type.startsWith("image/")) {
  //     setLogoFile(file)

  //     const reader = new FileReader()
  //     reader.onload = (e) => {
  //       const result = e.target?.result as string
  //       setLogoPreview(result)
  //       setOptions((prev) => ({ ...prev, logoUrl: result }))
  //     }
  //     reader.readAsDataURL(file)
  //   }
  // }

  // const removeLogo = () => {
  //   setLogoFile(null)
  //   setLogoPreview("")
  //   setOptions((prev) => ({ ...prev, logoUrl: undefined }))
  // }

  // const generateQRCode = async () => {
  //   if (!options.url.trim()) return

  //   setIsGenerating(true)

  //   try {
  //     const QRCode = (await import("qrcode")).default

  //     const canvas = canvasRef.current
  //     if (!canvas) return

  //     const ctx = canvas.getContext("2d")
  //     if (!ctx) return

  //     canvas.width = options.size
  //     canvas.height = options.size

  //     const qrData = await QRCode.create(options.url, {
  //       errorCorrectionLevel: options.errorCorrection,
  //       margin: options.margin,
  //     })

  //     // Clear canvas
  //     ctx.fillStyle = options.backgroundColor
  //     ctx.fillRect(0, 0, options.size, options.size)

  //     // Calculate module size
  //     const moduleCount = qrData.modules.size
  //     const moduleSize = (options.size - options.margin * 2) / moduleCount
  //     const offsetX = options.margin
  //     const offsetY = options.margin

  //     for (let row = 0; row < moduleCount; row++) {
  //       for (let col = 0; col < moduleCount; col++) {
  //         if (qrData.modules.get(row, col)) {
  //           const x = offsetX + col * moduleSize
  //           const y = offsetY + row * moduleSize

  //           ctx.fillStyle = options.foregroundColor

  //           // Check if this is a corner detection pattern
  //           const isCornerPattern =
  //             (row < 9 && col < 9) || // Top-left
  //             (row < 9 && col >= moduleCount - 9) || // Top-right
  //             (row >= moduleCount - 9 && col < 9) // Bottom-left

  //           if (isCornerPattern && options.cornerStyle !== "square") {
  //             // Apply rounded corners to corner patterns
  //             const radius = options.cornerStyle === "extra-rounded" ? moduleSize * 0.4 : moduleSize * 0.2
  //             ctx.beginPath()
  //             ctx.roundRect(x, y, moduleSize, moduleSize, radius)
  //             ctx.fill()
  //           } else {
  //             // Apply dot styling to data modules
  //             if (options.dotStyle === "rounded") {
  //               const radius = moduleSize * 0.2
  //               ctx.beginPath()
  //               ctx.roundRect(x, y, moduleSize, moduleSize, radius)
  //               ctx.fill()
  //             } else if (options.dotStyle === "dots") {
  //               const centerX = x + moduleSize / 2
  //               const centerY = y + moduleSize / 2
  //               const radius = moduleSize * 0.4
  //               ctx.beginPath()
  //               ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
  //               ctx.fill()
  //             } else {
  //               // Square style
  //               ctx.fillRect(x, y, moduleSize, moduleSize)
  //             }
  //           }
  //         }
  //       }
  //     }

  //     if (options.logoUrl) {
  //       const img = new Image()
  //       img.crossOrigin = "anonymous"
  //       img.onload = () => {
  //         const logoSize = (options.size * options.logoSize) / 100
  //         const x = (options.size - logoSize) / 2
  //         const y = (options.size - logoSize) / 2

  //         // Create logo background
  //         ctx.fillStyle = options.backgroundColor
  //         ctx.fillRect(x - 4, y - 4, logoSize + 8, logoSize + 8)

  //         // Draw logo
  //         ctx.drawImage(img, x, y, logoSize, logoSize)

  //         setQrCodeDataUrl(canvas.toDataURL())
  //       }
  //       img.src = options.logoUrl
  //     } else {
  //       setQrCodeDataUrl(canvas.toDataURL())
  //     }
  //   } catch (error) {
  //     console.error("Error generating QR code:", error)
  //   } finally {
  //     setIsGenerating(false)
  //   }
  // }

  // useEffect(() => {
  //   generateQRCode()
  // }, [options])

  // const downloadQRCode = () => {
  //   if (!qrCodeDataUrl) return

  //   const link = document.createElement("a")
  //   link.download = "qrcode.png"
  //   link.href = qrCodeDataUrl
  //   link.click()
  // }

  // const copyToClipboard = async () => {
  //   if (!qrCodeDataUrl) return

  //   try {
  //     const response = await fetch(qrCodeDataUrl)
  //     const blob = await response.blob()
  //     await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
  //   } catch (error) {
  //     console.error("Failed to copy to clipboard:", error)
  //   }
  // }

  // const shareQRCode = async () => {
  //   if (!qrCodeDataUrl) return

  //   try {
  //     // Check if Web Share API is supported and can share files
  //     if (navigator.share && navigator.canShare) {
  //       const response = await fetch(qrCodeDataUrl)
  //       const blob = await response.blob()
  //       const file = new File([blob], "qrcode.png", { type: "image/png" })

  //       // Check if we can share this specific data
  //       const shareData = {
  //         title: "QR Code",
  //         text: `QR Code for: ${options.url}`,
  //         files: [file],
  //       }

  //       if (navigator.canShare(shareData)) {
  //         await navigator.share(shareData)
  //         return
  //       }
  //     }

  //     // Fallback 1: Try sharing without files (text only)
  //     if (navigator.share) {
  //       await navigator.share({
  //         title: "QR Code",
  //         text: `Check out this QR code for: ${options.url}`,
  //         url: options.url,
  //       })
  //       return
  //     }

  //     // Fallback 2: Copy image to clipboard
  //     const response = await fetch(qrCodeDataUrl)
  //     const blob = await response.blob()

  //     if (navigator.clipboard && navigator.clipboard.write) {
  //       await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
  //       // Show success feedback (you could add a toast here)
  //       console.log("[v0] QR code image copied to clipboard")
  //       return
  //     }

  //     // Fallback 3: Copy data URL to clipboard
  //     if (navigator.clipboard && navigator.clipboard.writeText) {
  //       await navigator.clipboard.writeText(qrCodeDataUrl)
  //       console.log("[v0] QR code data URL copied to clipboard")
  //       return
  //     }

  //     // Final fallback: Download the file
  //     downloadQRCode()
  //     console.log("[v0] Sharing not supported, downloaded QR code instead")
  //   } catch (error) {
  //     console.error("Failed to share QR code:", error)

  //     // Ultimate fallback: try to download
  //     try {
  //       downloadQRCode()
  //       console.log("[v0] Share failed, downloaded QR code as fallback")
  //     } catch (downloadError) {
  //       console.error("Even download fallback failed:", downloadError)
  //     }
  //   }
  // }

  // const presetColors = [
  //   { name: "كلاسيكي", fg: "#000000", bg: "#ffffff" },
  //   { name: "فيرسل", fg: "#000000", bg: "#fafafa" },
  //   { name: "محيط", fg: "#0070f3", bg: "#f0f9ff" },
  //   { name: "غابة", fg: "#059669", bg: "#f0fdf4" },
  //   { name: "غروب", fg: "#dc2626", bg: "#fef2f2" },
  //   { name: "بنفسجي", fg: "#7c3aed", bg: "#faf5ff" },
  //   { name: "داكن", fg: "#ffffff", bg: "#000000" },
  //   { name: "رمادي", fg: "#f8fafc", bg: "#0f172a" },
  // ]

  // return (
  //   <div className="container p-6 max-w-7xl">
  //     <div className="mb-8">
  //       <div className="flex items-center gap-3 mb-2">
  //         <div className="p-2 bg-primary/10 rounded-lg">
  //           <QrCode className="h-6 w-6 text-primary" />
  //         </div>
  //         <h1 className="text-3xl font-bold text-foreground">منشئ رمز الاستجابة السريعة</h1>
  //         <Badge variant="secondary" className="ml-2">
  //           احترافي
  //         </Badge>

  //       </div>
  //       <p className="text-muted-foreground text-lg">
  //         أنشئ وخصص رموز الاستجابة السريعة للروابط المختصرة مع خيارات تصميم متقدمة
  //       </p>
  //     </div>

  //     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  //       <div className="lg:col-span-1">
  //         <Card className="sticky top-6">
  //           <CardHeader>
  //             <CardTitle className="flex items-center gap-2">
  //               <Eye className="h-5 w-5" />
  //               معاينة
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent className="space-y-4">
  //             <div className="flex justify-center p-8 bg-muted/30 rounded-lg border-2 border-dashed border-border">
  //               {qrCodeDataUrl ? (
  //                 <Image
  //                   src={qrCodeDataUrl || "/placeholder.svg"}
  //                   alt="QR Code"
  //                   className="max-w-full h-auto rounded-lg shadow-lg"
  //                   width={200}
  //                   height={200}
  //                 />
  //               ) : (
  //                 <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
  //                   <QrCode className="h-12 w-12 text-muted-foreground" />
  //                 </div>
  //               )}
  //             </div>

  //             <canvas ref={canvasRef} className="hidden" width={options.size} height={options.size} />

  //             <div className="flex gap-2">
  //               <Button onClick={downloadQRCode} className="flex-1" disabled={!qrCodeDataUrl}>
  //                 <Download className="h-4 w-4 mr-2" />
  //                 تحميل
  //               </Button>
  //               <Button variant="outline" onClick={copyToClipboard} disabled={!qrCodeDataUrl}>
  //                 <Copy className="h-4 w-4" />
  //               </Button>
  //               <Button variant="outline" onClick={shareQRCode} disabled={!qrCodeDataUrl}>
  //                 <Share2 className="h-4 w-4" />
  //               </Button>
  //             </div>

  //             {isGenerating && <div className="text-center text-sm text-muted-foreground">جارٍ إنشاء رمز الاستجابة السريعة...</div>}
  //           </CardContent>
  //         </Card>
  //       </div>

  //       <div className="lg:col-span-2">
  //         <Card>
  //           <CardHeader>
  //             <CardTitle className="flex items-center gap-2">
  //               <Settings className="h-5 w-5" />
  //               تخصيص رمز الاستجابة السريعة
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent>
  //             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
  //               <TabsList className="grid w-full grid-cols-3">
  //                 <TabsTrigger value="content" className="flex items-center gap-2">
  //                   <Link2 className="h-4 w-4" />
  //                   المحتوى
  //                 </TabsTrigger>
  //                 <TabsTrigger value="design" className="flex items-center gap-2">
  //                   <Palette className="h-4 w-4" />
  //                   التصميم
  //                 </TabsTrigger>
  //                 <TabsTrigger value="advanced" className="flex items-center gap-2">
  //                   <Settings className="h-4 w-4" />
  //                   متقدم
  //                 </TabsTrigger>
  //               </TabsList>

  //               <TabsContent value="content" className="space-y-6 mt-6" dir="rtl">
  //                 <div className="space-y-2">
  //                   <Label htmlFor="url" className="text-xl">الرابط</Label>
  //                   <Input
  //                     id="url"
  //                     value={options.url}
  //                     onChange={(e) => setOptions((prev) => ({ ...prev, url: e.target.value }))}
  //                     placeholder="أدخل الرابط أو النص المراد ترميزه"
  //                   />
  //                 </div>
  //               </TabsContent>

  //               <TabsContent value="design" className="space-y-6 mt-6" dir="rtl">
  //                 <div className="space-y-4">
  //                   <h3 className="text-lg font-semibold">قوالب الألوان</h3>
  //                   <div className="grid grid-cols-4 gap-3">
  //                     {presetColors.map((preset) => (
  //                       <Button
  //                         key={preset.name}
  //                         variant="outline"
  //                         className="h-auto p-3 flex flex-col items-center gap-2 bg-transparent"
  //                         onClick={() =>
  //                           setOptions((prev) => ({
  //                             ...prev,
  //                             foregroundColor: preset.fg,
  //                             backgroundColor: preset.bg,
  //                           }))
  //                         }
  //                       >
  //                         <div className="flex gap-1">
  //                           <div className="w-4 h-4 rounded border" style={{ backgroundColor: preset.fg }} />
  //                           <div className="w-4 h-4 rounded border" style={{ backgroundColor: preset.bg }} />
  //                         </div>
  //                         <span className="text-xs">{preset.name}</span>
  //                       </Button>
  //                     ))}
  //                   </div>
  //                 </div>

  //                 <Separator />

  //                 <div className="grid grid-cols-2 gap-6">
  //                   <div className="space-y-4">
  //                     <Label htmlFor="foreground">اللون الأمامي</Label>
  //                     <div className="flex gap-2">
  //                       <Input
  //                         id="foreground"
  //                         type="color"
  //                         value={options.foregroundColor}
  //                         onChange={(e) => setOptions((prev) => ({ ...prev, foregroundColor: e.target.value }))}
  //                         className="w-16 h-10 p-1 border rounded"
  //                       />
  //                       <Input
  //                         value={options.foregroundColor}
  //                         onChange={(e) => setOptions((prev) => ({ ...prev, foregroundColor: e.target.value }))}
  //                         className="font-mono"
  //                       />
  //                     </div>
  //                   </div>

  //                   <div className="space-y-4">
  //                     <Label htmlFor="background">اللون الخلفي</Label>
  //                     <div className="flex gap-2">
  //                       <Input
  //                         id="background"
  //                         type="color"
  //                         value={options.backgroundColor}
  //                         onChange={(e) => setOptions((prev) => ({ ...prev, backgroundColor: e.target.value }))}
  //                         className="w-16 h-10 p-1 border rounded"
  //                       />
  //                       <Input
  //                         value={options.backgroundColor}
  //                         onChange={(e) => setOptions((prev) => ({ ...prev, backgroundColor: e.target.value }))}
  //                         className="font-mono"
  //                       />
  //                     </div>
  //                   </div>
  //                 </div>

  //                 <Separator />

  //                 <div className="space-y-4">
  //                   <div className="space-y-2">
  //                     <Label>الحجم: {options.size}px</Label>
  //                     <Slider
  //                       dir="rtl"
  //                       value={[options.size]}
  //                       onValueChange={([value]) => setOptions((prev) => ({ ...prev, size: value }))}
  //                       min={128}
  //                       max={512}
  //                       step={32}
  //                       className="w-full"
  //                     />
  //                   </div>

  //                   <div className="space-y-2 mt-8">
  //                     <Label className="text-base font-semibold">الشعار</Label>

  //                     {!logoPreview ? (
  //                       <div className="space-y-3">
  //                         <div className="flex gap-2">
  //                           <Button
  //                             variant="outline"
  //                             onClick={() => fileInputRef.current?.click()}
  //                             className="flex items-center gap-2"
  //                           >
  //                             <Upload className="h-4 w-4" />
  //                             رفع الشعار
  //                           </Button>
  //                           <span className="text-sm text-muted-foreground self-center">أو</span>
  //                         </div>

  //                         <div className="space-y-2 mt-2">
  //                           <Label htmlFor="logo-url" className="text-base">
  //                             رابط الشعار
  //                           </Label>
  //                           <Input
  //                             id="logo-url"
  //                             value={options.logoUrl || ""}
  //                             onChange={(e) => setOptions((prev) => ({ ...prev, logoUrl: e.target.value }))}
  //                             placeholder="https://example.com/logo.png"
  //                             className="text-base"
  //                           />
  //                         </div>
  //                       </div>
  //                     ) : (
  //                       <div className="space-y-3">
  //                         <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
  //                           <Image
  //                             src={logoPreview || "/placeholder.svg"}
  //                             alt="Logo preview"
  //                             width={50}
  //                             height={50}
  //                             className="w-12 h-12 object-contain rounded border bg-white"
  //                           />
  //                           <div className="flex-1">
  //                             <p className="text-sm font-medium">{logoFile?.name || "Logo from URL"}</p>
  //                             <p className="text-xs text-muted-foreground">
  //                               {logoFile ? `${(logoFile.size / 1024).toFixed(1)} KB` : "External image"}
  //                             </p>
  //                           </div>
  //                           <Button
  //                             variant="ghost"
  //                             size="sm"
  //                             onClick={removeLogo}
  //                             className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
  //                           >
  //                             <X className="h-4 w-4" />
  //                           </Button>
  //                         </div>
  //                       </div>
  //                     )}

  //                     <input
  //                       ref={fileInputRef}
  //                       type="file"
  //                       accept="image/*"
  //                       onChange={handleLogoUpload}
  //                       className="hidden"
  //                     />

  //                     {(options.logoUrl || logoPreview) && (
  //                       <div className="space-y-2 mt-4">
  //                         <Label>حجم الشعار: {options.logoSize}%</Label>
  //                         <Slider
  //                           dir="rtl"
  //                           value={[options.logoSize]}
  //                           onValueChange={([value]) => setOptions((prev) => ({ ...prev, logoSize: value }))}
  //                           min={10}
  //                           max={30}
  //                           step={2}
  //                           className="w-full"
  //                         />
  //                         <p className="text-xs text-muted-foreground">موصى به: 15-25% للمسح الأمثل</p>
  //                       </div>
  //                     )}
  //                   </div>
  //                 </div>
  //               </TabsContent>

  //               <TabsContent value="advanced" className="space-y-6 mt-6" dir="rtl">
  //                 <div className="grid grid-cols-2 gap-6">
  //                   <div className="space-y-2">
  //                     <Label>تصحيح الأخطاء</Label>
  //                     <Select
  //                       dir="rtl"
  //                       value={options.errorCorrection}
  //                       onValueChange={(value: "L" | "M" | "Q" | "H") =>
  //                         setOptions((prev) => ({ ...prev, errorCorrection: value }))
  //                       }
  //                     >
  //                       <SelectTrigger>
  //                         <SelectValue />
  //                       </SelectTrigger>
  //                       <SelectContent>
  //                         <SelectItem value="L">منخفض (~7%)</SelectItem>
  //                         <SelectItem value="M">متوسط (~15%)</SelectItem>
  //                         <SelectItem value="Q">الربع (~25%)</SelectItem>
  //                         <SelectItem value="H">عالي (~30%)</SelectItem>
  //                       </SelectContent>
  //                     </Select>
  //                     <p className="text-sm text-muted-foreground">
  //                       المستويات الأعلى قد تؤدي أكثر إلى التلف لكنها تنشئ رموز أكبر
  //                     </p>
  //                   </div>

  //                   <div className="space-y-2">
  //                     <Label >الهامش: px{options.margin}</Label>
  //                     <Slider
  //                       dir="rtl"
  //                       value={[options.margin]}
  //                       onValueChange={([value]) => setOptions((prev) => ({ ...prev, margin: value }))}
  //                       min={0}
  //                       max={10}
  //                       step={1}
  //                       className="w-full"
  //                     />
  //                   </div>
  //                 </div>

  //                 <Separator />

  //                 <div className="space-y-4">
  //                   <h3 className="text-lg font-semibold">خيارات النمط</h3>
  //                   <div className="grid grid-cols-2 gap-6">
  //                     <div className="space-y-2">
  //                       <Label>نمط الزوايا</Label>
  //                       <Select
  //                         dir="rtl"
  //                         value={options.cornerStyle}
  //                         onValueChange={(value: "square" | "rounded" | "extra-rounded") =>
  //                           setOptions((prev) => ({ ...prev, cornerStyle: value }))
  //                         }
  //                       >
  //                         <SelectTrigger>
  //                           <SelectValue />
  //                         </SelectTrigger>
  //                         <SelectContent>
  //                           <SelectItem value="square">مربع</SelectItem>
  //                           <SelectItem value="rounded">مدور</SelectItem>
  //                           <SelectItem value="extra-rounded">مدور جداً</SelectItem>
  //                         </SelectContent>
  //                       </Select>
  //                     </div>

  //                     <div className="space-y-2">
  //                       <Label>نمط النقاط</Label>
  //                       <Select
  //                         dir="rtl"
  //                         value={options.dotStyle}
  //                         onValueChange={(value: "square" | "rounded" | "dots") =>
  //                           setOptions((prev) => ({ ...prev, dotStyle: value }))
  //                         }
  //                       >
  //                         <SelectTrigger>
  //                           <SelectValue />
  //                         </SelectTrigger>
  //                         <SelectContent>
  //                           <SelectItem value="square">مربع</SelectItem>
  //                           <SelectItem value="rounded">مدور</SelectItem>
  //                           <SelectItem value="dots">نقاط دائرية</SelectItem>
  //                         </SelectContent>
  //                       </Select>
  //                     </div>
  //                   </div>
  //                 </div>

  //                 <Separator />

  //                 <div className="space-y-4">
  //                   <h3 className="text-lg font-semibold">Export Options</h3>
  //                   <div className="grid grid-cols-3 gap-3">
  //                     <Button variant="outline" onClick={downloadQRCode} disabled={!qrCodeDataUrl}>
  //                       PNG
  //                     </Button>
  //                     <Button variant="outline" disabled>
  //                       SVG
  //                     </Button>
  //                     <Button variant="outline" disabled>
  //                       PDF
  //                     </Button>
  //                   </div>
  //                 </div>
  //               </TabsContent>
  //             </Tabs>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     </div>
  //   </div>
  // )
}
