import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import type React from "react"

export const metadata: Metadata = {
  title: "Projetos | Rafaela Andrade - Arquitetura de Interiores",
  description: "Conheça os projetos de arquitetura de interiores desenvolvidos por Rafaela Andrade.",
}

export default function ProjectsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f0f0f0]/70 backdrop-blur-sm border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-medium text-black">
                <Image
                  src={"/images/marca/marca-no-back.png"}
                  alt={"Logo Rafaela Andrade"}
                  width={100}
                  height={100}
                />
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/#sobre" className="text-sm text-black/70 hover:text-black transition-colors">
                Sobre
              </a>
              <a href="/projetos" className="text-sm text-black hover:text-black transition-colors">
                Projetos
              </a>
              <a href="/#servicos" className="text-sm text-black/70 hover:text-black transition-colors">
                Serviços
              </a>
              <a href="/#contato" className="text-sm text-black/70 hover:text-black transition-colors">
                Contato
              </a>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </>
  )
}
