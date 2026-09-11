import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("h-12 w-full rounded-xl border border-bronze/40 bg-ink px-3 text-cream placeholder:text-cream/35 outline-none focus:border-gold", className)} {...props} />;
}
export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("min-h-24 w-full rounded-xl border border-bronze/40 bg-ink px-3 py-3 text-cream placeholder:text-cream/35 outline-none focus:border-gold", className)} {...props} />;
}
