import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("us-EG", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price)
}
