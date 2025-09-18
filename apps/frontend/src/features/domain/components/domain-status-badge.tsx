import clsx from "clsx";
import { Status } from "@/features/domain/types";

// نحتفظ بالقيم بالإنجليزي
export const statusMap: Record<Status, string> = {
    pending: "قيد المراجعة",
    ssl_provisioning: "جاري إصدار SSL",
    active: "مفعل",
    failed: "فشل"
}

function DomainStatusBadge({ status }: { status: Status }) {
    const containerStyle: Record<Status, string> = {
        pending: "bg-yellow-200",
        ssl_provisioning: "bg-blue-200",
        active: "bg-green-200",
        failed: "bg-red-200"
    }

    const circleStyle: Record<Status, string> = {
        pending: "bg-yellow-500",
        ssl_provisioning: "bg-blue-500",
        active: "bg-green-500",
        failed: "bg-red-500"
    }

    const childStyle: Record<Status, string> = {
        pending: "text-yellow-800",
        ssl_provisioning: "text-blue-800",
        active: "text-green-800",
        failed: "text-red-800"
    }

    return (
        <div className="lg:text-md pr-8">
            <div
                className={clsx(
                    "flex items-center px-2 gap-4 py-[1px] w-fit rounded-xl",
                    containerStyle[status]
                )}
            >
                <div
                    className={clsx("w-[10px] h-[10px] rounded-full", circleStyle[status])}
                ></div>
                {/* نعرض النسخة بالعربي */}
                <p className={childStyle[status]}>{statusMap[status]}</p>
            </div>
        </div>
    );
}

export default DomainStatusBadge;
