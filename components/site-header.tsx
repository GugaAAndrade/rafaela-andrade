"use client"

import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/ui"

const links = [
  { href: "/projetos", label: "projetos" },
  { href: "/sobre", label: "sobre" },
  { href: "/#feedbacks", label: "feedbacks" },
  { href: "/contato", label: "contato" }
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  function navigateMobile(href: string) {
    setOpen(false)

    if (href === "/#feedbacks" && pathname === "/") {
      requestAnimationFrame(() => {
        document.getElementById("feedbacks")?.scrollIntoView({ behavior: "smooth", block: "start" })
      })
      return
    }

    router.push(href)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-paper/95 backdrop-blur lg:inset-y-0 lg:left-0 lg:right-auto lg:w-36 lg:border-b-0 lg:border-r">
      <nav
        className="flex items-center justify-between gap-3 px-3 py-3 lg:relative lg:min-h-screen lg:flex-col lg:items-start lg:justify-start lg:px-5 lg:py-6"
        aria-label="Principal"
      >
        <Link
          href="/"
          className="block w-fit"
          aria-label="Rafaela Andrade Arquitetura de Interiores"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/brand/rafaela-monogram.png"
            alt="Monograma Rafaela Andrade"
            width={295}
            height={399}
            className="h-auto w-[30px] object-contain sm:w-[32px] lg:w-[34px]"
            priority
          />
        </Link>

        <div className="hidden flex-wrap gap-x-4 gap-y-2 text-[0.92rem] text-muted lg:absolute lg:left-5 lg:top-1/2 lg:grid lg:-translate-y-1/2 lg:gap-2">
          {links.map((link) => (
            <Link key={link.href} className="transition hover:text-ink" href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-site-menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line bg-soft text-ink transition hover:bg-black/5"
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

      </nav>

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-full border-b border-line bg-paper opacity-0 transition lg:hidden",
          open && "pointer-events-auto opacity-100"
        )}
        id="mobile-site-menu"
      >
        <div className="grid gap-1 px-3 py-3">
          {links.map((link) => (
            <button
              key={link.href}
              type="button"
              className="rounded-md px-3 py-3 text-left text-[0.98rem] text-ink transition hover:bg-black/5"
              onClick={() => navigateMobile(link.href)}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
