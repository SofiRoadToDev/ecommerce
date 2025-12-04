import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  const locale = process.env.NEXT_PUBLIC_LOCALE || 'en'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}