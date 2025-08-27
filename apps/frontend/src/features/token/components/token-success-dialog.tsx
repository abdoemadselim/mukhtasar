import { useState } from "react"
import { Copy, CheckCircle, Eye, EyeOff, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

type TokenSuccessDialogProps = {
    isOpen: boolean
    onClose: () => void
    token: string
}

export function TokenSuccessDialog({ isOpen, onClose, token }: TokenSuccessDialogProps) {
    const [showToken, setShowToken] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(token)
        setCopied(true)
        toast("تم نسخ الرمز إلى حافظة جهازك!")
        setTimeout(() => setCopied(false), 2000)
    }

    const handleClose = () => {
        setShowToken(false)
        setCopied(false)
        onClose()
    }

    const maskedToken = token.replace(/(.{4}).*(.{4})/, '$1' + '•'.repeat(token.length) + '$2')

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="text-center space-y-3">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <DialogTitle className="text-xl text-center">تم إنشاء رمز الوصول بنجاح!</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <Alert className="border-amber-200 bg-amber-50">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800 text-right">
                            <strong>تنبيه هام:</strong> هذا الرمز سيظهر مرة واحدة فقط. تأكد من نسخه وحفظه في مكان آمن.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                        <Label htmlFor="token-display">رمز الوصول الجديد</Label>
                        <div className="flex gap-2">
                            <Input
                                id="token-display"
                                value={showToken ? token : maskedToken}
                                readOnly
                                className="font-mono text-sm bg-muted"
                                dir="ltr"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setShowToken(!showToken)}
                                className="shrink-0"
                            >
                                {showToken ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleCopy}
                                className="shrink-0"
                                disabled={copied}
                            >
                                {copied ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground text-right">
                            اضغط على العين لإظهار/إخفاء الرمز، واضغط على النسخ لنسخه
                        </p>
                    </div>

                </div>

                <DialogFooter className="flex-col sm:flex-col space-y-2">
                    <Button
                        onClick={handleCopy}
                        className="w-full cursor-pointer"
                        variant={copied ? "outline" : "default"}
                    >
                        {copied ? (
                            <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                تم النسخ!
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4 mr-2" />
                                نسخ الرمز
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className="w-full cursor-pointer"
                    >
                        إغلاق
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}