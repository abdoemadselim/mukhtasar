"use client"

import clsx from "clsx"
import { CheckCircle2, MessageCircleWarning } from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}


const openToaster = (text: string, type: "error" | "success") => {
  const icons = {
    "error": <MessageCircleWarning />,
    "success": <CheckCircle2 />
  }

  const component = (
    <div className={clsx("rounded-md w-fit min-w-[430px] px-4 py-2 flex gap-4", type === "success" && "bg-primary text-white", type === "error" && "bg-red-500 text-white")}>
      {icons[type]}
      <p> {text}</p>
    </div >
  )

  return toast.custom((t) => component);
}

export { Toaster, openToaster }
