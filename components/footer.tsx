import Image from "next/image"
import { shellClass } from "@/lib/ui"

export function Footer() {
  return (
    <footer className="border-t border-line bg-soft lg:pl-36">
      <div
        className={`${shellClass} flex flex-col items-center gap-4 px-0 py-8 text-center text-sm text-muted md:flex-row md:items-end md:justify-between md:text-left`}
      >
        <Image
          src="/brand/rafaela-wordmark.png"
          alt="Rafaela Andrade Arquitetura de Interiores"
          width={897}
          height={272}
          className="h-auto w-[182px] object-contain"
        />
        <span>Aracaju | Arquiteta de Interiores</span>
      </div>
    </footer>
  )
}
