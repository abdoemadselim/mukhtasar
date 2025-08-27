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

export function UpdateUrlDialog({ children }: { children: React.ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="flex flex-col items-start pt-4 pb-2">
                    <DialogTitle>تعديل الرابط الأصلي</DialogTitle>
                    <DialogDescription>
                        يمكنك تغيير الرابط الأصلي المرتبط بالرابط المختصر.
                    </DialogDescription>
                </DialogHeader>

                {/* The Update Form */}
                <form action={"#"}>
                    <div className="grid gap-4 pb-6">

                        {/* Short URL - Readonly */}
                        <div className="grid gap-3">
                            <Label htmlFor="short-url">الرابط المختصر</Label>
                            <Input
                                disabled
                                id="short-url"
                                name="short_url"
                                value="https://minimo.io/abc123"
                                readOnly
                                className="bg-muted"
                            />
                        </div>

                        {/* Original URL - Editable */}
                        <div className="grid gap-3">
                            <Label htmlFor="original-url">الرابط الأصلي</Label>
                            <Input
                                id="original-url"
                                name="original_url"
                                placeholder="https://example.com/your-page"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button variant="outline" className="cursor-pointer">إلغاء</Button>
                        </DialogClose>
                        <Button type="submit" className="cursor-pointer">حفظ التغييرات</Button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog >
    )
}
