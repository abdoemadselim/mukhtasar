'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { AddDomainSchema, AddDomainType } from "@mukhtasar/shared"

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

import { useAddDomain } from "@/features/domain/hooks/domain-query"
import DomainInstructionsDialog from "@/features/domain/components/domain-instructions-dialog"

export default function CreateDomainDialog({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [showDNSInstructions, setShowDNSInstructions] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        getValues
    } = useForm<AddDomainType>({
        resolver: zodResolver(AddDomainSchema),
        defaultValues: {
            domain: "",
        },
    })

    const { mutateAsync, isError, error } = useAddDomain()

    const onSubmit = async (data: AddDomainType) => {
        await mutateAsync(data)
        setIsOpen(false)
        setShowDNSInstructions(true)

        openToaster("تم إضافة النطاق بنجاح. يرجى اتباع التعليمات لإكمال الإعداد.", "success")
    }

    useEffect(() => {
        if (isError) {
            openToaster(error?.message as string, "error")
        }
    }, [isError, error])

    const handleClose = () => {
        setIsOpen(false)
        reset()
    }

    const handleDomainInstructionsClose = () => {
        setShowDNSInstructions(false)
        reset()
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] pt-10">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogHeader className="pb-4">
                            <DialogTitle className="text-right">إضافة نطاق مخصص</DialogTitle>
                            <DialogDescription className="text-right">
                                أدخل النطاق المخصص الذي تريد استخدامه لاختصار الروابط. سيتم إصدار شهادة SSL تلقائياً.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 pb-6">
                            <div className="grid gap-3">
                                <Label htmlFor="domain">النطاق <span className="text-red-500">*</span></Label>
                                <Input
                                    {...register("domain")}
                                    id="domain"
                                    placeholder="example.com أو go.example.com"
                                    dir="ltr"
                                />

                                {errors?.domain && (
                                    <div id="domain-error" aria-live="polite" aria-atomic="true">
                                        <p className="text-sm text-red-500" role="alert">
                                            {errors.domain.message}
                                        </p>
                                    </div>
                                )}

                                <p className="text-xs text-muted-foreground text-right">
                                    يمكنك استخدام نطاق رئيسي (example.com) أو نطاق فرعي (go.example.com)
                                </p>
                            </div>

                            <p className="text-xs text-muted-foreground text-right">
                                تأكد من أنك تملك هذا النطاق وتستطيع تعديل إعدادات DNS الخاصة به
                            </p>
                        </div>
                        <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                                <Button variant="outline" className="cursor-pointer" onClick={handleClose}>
                                    إلغاء
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                className="cursor-pointer"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "جاري الإضافة..." : "إضافة النطاق"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <DomainInstructionsDialog
                domainType="subdomain" // Always subdomain for Cloudflare
                isOpen={showDNSInstructions}
                onClose={handleDomainInstructionsClose}
                domain={getValues("domain")}
            />
        </>
    )
}