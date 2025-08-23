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
import React from "react"

export function CreateUrlDialog({ children }: { children: React.ReactNode }) {
    return (
        <Dialog>

            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] pt-10">
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-right">إنشاء رابط مختصر</DialogTitle>
                    <DialogDescription className="text-right">
                        أدخل الرابط الأصلي وقم بتخصيص بيانات الرابط المختصر إذا رغبت.
                    </DialogDescription>
                </DialogHeader>
                <form>
                    <div className="grid gap-4 pb-6">
                        {/* Original URL (required) */}
                        <div className="grid gap-3">
                            <Label htmlFor="original-url">الرابط الأصلي <span className="text-red-500">*</span></Label>
                            <Input
                                id="original-url"
                                name="original_url"
                                placeholder="https://example.com/page"
                                required
                            />
                        </div>

                        {/* Optional description */}
                        <div className="grid gap-3">
                            <Label htmlFor="description">الوصف (اختياري)</Label>
                            <Input
                                id="description"
                                name="description"
                                placeholder="أدخل وصفاً للرابط"
                            />
                        </div>

                        {/* Optional alias */}
                        <div className="grid gap-3">
                            <Label htmlFor="alias">الاسم المستعار (اختياري).</Label>
                            <Input
                                id="alias"
                                name="alias"
                                placeholder="مثال: my-link"
                            />
                        </div>

                        {/* Optional domain */}
                        <div className="grid gap-3">
                            <Label htmlFor="domain">النطاق (اختياري)</Label>
                            <Input
                                id="domain"
                                name="domain"
                                placeholder="مثال: short.me"
                            />
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button variant="outline" className="cursor-pointer">إلغاء</Button>
                        </DialogClose>
                        <Button type="submit" className="cursor-pointer">إنشاء</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}
