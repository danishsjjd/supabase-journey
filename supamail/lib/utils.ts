import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dateIOSFormat = (date: string) =>
  new Date(
    date.split("+")[1] || date.toLowerCase().endsWith("z") ? date : `${date}Z`
  );
