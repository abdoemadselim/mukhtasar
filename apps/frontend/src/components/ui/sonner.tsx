"use client"

import { CheckCircle2 } from "lucide-react"
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


const openToaster = (text: string) => {
  return toast.custom((t) => (
    <div className="bg-primary text-white rounded-md w-fit px-7 py-2 flex gap-4">
      <CheckCircle2 />
      <p>{text}</p>
    </div>
  ));
}

export { Toaster, openToaster }
