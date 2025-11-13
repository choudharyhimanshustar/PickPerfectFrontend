import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility to merge class names conditionally.
 * Used by shadcn/ui components to handle Tailwind className merging.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
