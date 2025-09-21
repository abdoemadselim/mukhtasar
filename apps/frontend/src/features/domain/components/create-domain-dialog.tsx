// Update apps/frontend/src/features/domain/components/create-domain-dialog.tsx

'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
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
import { Checkbox } from "@/components/ui/checkbox"

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
        control,
        watch,
        getValues
    } = useForm<AddDomainType>({
        resolver: zodResolver(AddDomainSchema),
        defaultValues: {
            domain: "",
            domain_type: "subdomain",
        },
    })

    const { mutateAsync, isError, error } = useAddDomain()
    const watchedDomainType = watch("domain_type")

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
                                أدخل النطاق المخصص الذي تريد استخدامه لاختصار الروابط
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 pb-6">
                            <div className="grid gap-3">
                                <Label htmlFor="domain">النطاق <span className="text-red-500">*</span></Label>
                                <Input
                                    {...register("domain")}
                                    id="domain"
                                    placeholder="example.com"
                                    dir="ltr"
                                />

                                {errors?.domain && (
                                    <div id="domain-error" aria-live="polite" aria-atomic="true">
                                        <p className="text-sm text-red-500" role="alert">
                                            {errors.domain.message}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Domain Type Selection */}
                            <div className="grid gap-3">
                                <Label className="text-sm font-medium">نوع النطاق</Label>

                                {/* Subdomain Checkbox */}
                                <div className="flex items-center gap-3">
                                    <Controller
                                        name="domain_type"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value === "subdomain"}
                                                onCheckedChange={(checked) => {
                                                    if (checked) field.onChange("subdomain")
                                                }}
                                                id="is_subdomain"
                                            />
                                        )}
                                    />
                                    <Label htmlFor="is_subdomain" className="text-sm">
                                        نطاق فرعي (Subdomain)
                                    </Label>
                                </div>

                                {/* Domain Checkbox */}
                                <div className="flex items-center gap-3">
                                    <Controller
                                        name="domain_type"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value === "domain"}
                                                onCheckedChange={(checked) => {
                                                    if (checked) field.onChange("domain")
                                                }}
                                                id="is_domain"
                                            />
                                        )}
                                    />
                                    <Label htmlFor="is_domain" className="text-sm">
                                        نطاق رئيسي (Domain)
                                    </Label>
                                </div>

                                {/* Dynamic Helper Text */}
                                <p className="text-xs text-muted-foreground text-right">
                                    {watchedDomainType === "domain"
                                        ? "مثال: example.com - ستحتاج إلى إعداد A Record"
                                        : "مثال: go.example.com - ستحتاج إلى إعداد CNAME Record"
                                    }
                                </p>

                                {/* Domain Type Validation Error */}
                                {errors?.domain_type && (
                                    <div aria-live="polite" aria-atomic="true">
                                        <p className="text-sm text-red-500" role="alert">
                                            {errors.domain_type.message}
                                        </p>
                                    </div>
                                )}
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
                domainType={getValues("domain_type") as "domain" | "subdomain"}
                isOpen={showDNSInstructions}
                onClose={handleDomainInstructionsClose}
                domain={getValues("domain")}
            />
        </>
    )
}