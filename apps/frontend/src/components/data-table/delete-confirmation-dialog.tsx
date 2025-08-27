'use client'
import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"

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

import { useDeleteToken } from "@/features/token/hooks/tokens-query"
import { TokenType } from "@mukhtasar/shared"


type DeleteConfirmationDialogProps<T> = {
    children: React.ReactNode
    title: string
    description: string
    confirmationText: string
    confirmationLabel: string,
    deleteResourceMutation: () => Promise<T>
}

export function DeleteConfirmationDialog<T>({
    children,
    deleteResourceMutation,
    title,
    description,
    confirmationText,
    confirmationLabel,
}: DeleteConfirmationDialogProps<T>) {
    const [inputValue, setInputValue] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const handleClose = () => {
        setIsOpen(false)
        setInputValue("")
    }

    const handleDeleteToken = (e: React.FormEvent) => {
        e.preventDefault()
        if (inputValue === confirmationText) {
            deleteResourceMutation()
            setIsOpen(false)
            setInputValue("")
        }
    }

    const isValid = inputValue === confirmationText

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild onClick={() => setIsOpen(true)}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1 text-right">
                            <DialogTitle className="text-right text-lg font-semibold">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="text-right text-sm text-muted-foreground mt-1">
                                {description}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-right">
                        <p className="text-sm text-red-800 mb-2">
                            هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف البيانات نهائياً.
                        </p>
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="confirmation-input" className="text-right">
                            {confirmationLabel}
                        </Label>
                        <div className="text-right">
                            <Input
                                value={confirmationText}
                                readOnly
                                className="font-mono text-sm bg-gray-200"
                            />
                        </div>
                        <Input
                            id="confirmation-input"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={`اكتب "${confirmationText}" للتأكيد`}
                            className="text-right"
                            autoComplete="off"
                            dir="ltr"
                        />
                    </div>
                </div>

                <DialogFooter className="sm:justify-start gap-2">
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="cursor-pointer"
                        >
                            إلغاء
                        </Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        disabled={!isValid}
                        className="cursor-pointer"
                        onClick={handleDeleteToken}
                    >
                        تأكيد الحذف
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}