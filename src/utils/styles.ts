import { type ClassValue, clsx } from "clsx"
import { cva } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export { cn, cva }
