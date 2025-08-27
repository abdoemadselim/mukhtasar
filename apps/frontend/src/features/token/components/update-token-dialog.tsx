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
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

interface UpdateTokenDialogProps {
    children: React.ReactNode
    currentToken?: {
        id: number
        label: string
        can_create: boolean
        can_update: boolean
        can_delete: boolean
    }
}

export default function UpdateTokenDialog({ children, currentToken }: UpdateTokenDialogProps) {
    const [formData, setFormData] = useState({
        label: currentToken?.label || "",
        can_create: currentToken?.can_create || false,
        can_update: currentToken?.can_update || false,
        can_delete: currentToken?.can_delete || false,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Your update logic here
        console.log("Updating token with:", formData)
    }

    return (
        <Dialog>
            <form onSubmit={handleSubmit}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="flex flex-col items-start pt-4 pb-2">
                        <DialogTitle>تعديل رمز الوصول</DialogTitle>
                        <DialogDescription>
                            يمكنك تغيير تسمية الرمز أو تحديث صلاحياته.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        {/* Label */}
                        <div className="grid gap-3">
                            <Label htmlFor="label">التسمية</Label>
                            <Input
                                id="label"
                                name="label"
                                value={formData.label}
                                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                maxLength={100}
                            />
                        </div>
                        {/* Permissions */}
                        <div className="grid gap-4">
                            <Label className="text-base font-medium">الصلاحيات</Label>

                            <div className="flex items-center space-x-2 space-x-reverse">
                                <Checkbox
                                    id="can_create"
                                    name="can_create"
                                    checked={formData.can_create}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, can_create: !!checked })
                                    }
                                />
                                <Label htmlFor="can_create" className="text-sm font-normal">
                                    صلاحية الإنشاء
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2 space-x-reverse">
                                <Checkbox
                                    id="can_update"
                                    name="can_update"
                                    checked={formData.can_update}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, can_update: !!checked })
                                    }
                                />
                                <Label htmlFor="can_update" className="text-sm font-normal">
                                    صلاحية التحديث
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2 space-x-reverse">
                                <Checkbox
                                    id="can_delete"
                                    name="can_delete"
                                    checked={formData.can_delete}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, can_delete: !!checked })
                                    }
                                />
                                <Label htmlFor="can_delete" className="text-sm font-normal">
                                    صلاحية الحذف
                                </Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button variant="outline" className="cursor-pointer">إلغاء</Button>
                        </DialogClose>
                        <Button type="submit" className="cursor-pointer">حفظ التغييرات</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}