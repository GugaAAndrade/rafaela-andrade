import { clsx } from "clsx"

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values)
}

export const shellClass = "mx-auto w-[min(1160px,calc(100vw-24px))] md:w-[min(1160px,calc(100vw-32px))] lg:w-[min(1160px,calc(100vw-192px))]"

export const pageMainClass = "min-h-screen bg-paper pt-[73px] text-ink lg:pl-36 lg:pt-0"

export const sectionClass = "py-12 md:py-20 xl:py-28"

export const eyebrowClass =
  "mb-4 text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-muted"

export const textMutedClass = "text-[0.95rem] leading-7 text-muted md:text-[0.98rem]"

export const buttonPrimaryClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-ink bg-ink px-5 text-sm font-semibold text-white transition hover:border-black hover:bg-black"

export const buttonGhostClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-ink/60 bg-transparent px-4 text-sm font-semibold text-ink transition hover:border-ink hover:bg-black/5 md:px-5"

export const textLinkClass =
  "inline-flex items-center gap-2 border-b border-current text-[0.78rem] font-extrabold uppercase tracking-[0.14em] text-ink"

export const panelClass =
  "rounded-md border border-line bg-soft p-4 shadow-[0_18px_46px_rgba(32,33,29,0.06)] md:p-7"

export const inputClass =
  "w-full rounded-md border border-line bg-[#fdfdfb] px-3 py-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-ink focus:ring-2 focus:ring-black/10"

export const textareaClass = `${inputClass} min-h-32 resize-y md:min-h-36`

export const labelClass =
  "text-[0.78rem] font-extrabold uppercase tracking-[0.08em] text-muted"

export const fieldClass = "grid gap-2"
