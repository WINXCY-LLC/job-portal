import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatSalary(min?: number | null, max?: number | null): string {
  if (!min && !max) return "応相談";
  const fmt = (n: number) =>
    new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(n);
  if (min && max) return `${fmt(min)} 〜 ${fmt(max)}`;
  if (min) return `${fmt(min)} 〜`;
  if (max) return `〜 ${fmt(max)}`;
  return "応相談";
}
