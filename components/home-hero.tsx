"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { Project } from "@/lib/types"
import { buttonPrimaryClass, cn, eyebrowClass, textLinkClass, textMutedClass } from "@/lib/ui"

type HomeHeroProps = {
  projects: Project[]
}

export function HomeHero({ projects }: HomeHeroProps) {
  const slides = useMemo(() => projects.filter((project) => project.coverUrl), [projects])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 4800)

    return () => window.clearInterval(interval)
  }, [slides.length])

  if (!slides.length) return null

  const activeProject = slides[activeIndex]

  return (
    <section className="relative grid min-h-[calc(100svh-73px)] overflow-hidden bg-soft lg:min-h-screen lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)]">
      <div className="relative h-[48svh] min-h-[320px] bg-ink sm:h-[52svh] lg:min-h-screen lg:h-auto">
        {slides.map((project, index) => (
          <img
            key={project.id}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
              index === activeIndex ? "opacity-100" : "opacity-0"
            )}
            src={project.coverUrl}
            alt={`Imagem do projeto ${project.title}`}
          />
        ))}

        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 md:inset-x-6 md:bottom-6 lg:left-[168px] lg:right-6">
          <div className="flex max-w-[calc(100%-56px)] flex-wrap gap-x-3 gap-y-1 text-[0.64rem] font-bold uppercase tracking-[0.14em] text-white sm:text-[0.72rem] md:max-w-none md:text-[0.8rem]">
            <span>{activeProject.title}</span>
            <span>{activeProject.location}</span>
          </div>
          {slides.length > 1 ? (
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                aria-label="Projeto anterior"
                onClick={() => setActiveIndex((current) => (current - 1 + slides.length) % slides.length)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur transition hover:bg-black/35"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Proximo projeto"
                onClick={() => setActiveIndex((current) => (current + 1) % slides.length)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur transition hover:bg-black/35"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex min-h-0 flex-col justify-center bg-paper px-4 py-7 sm:px-5 sm:py-8 md:px-6 md:py-12 xl:px-18 lg:min-h-screen lg:py-14">
        <p className={eyebrowClass}>Arquitetura de Interiores</p>
        <h1 className="max-w-[11ch] text-[clamp(2.1rem,10vw,5rem)] leading-[0.96] font-light sm:max-w-[13ch]">
          Espacos pensados para a vida acontecer com calma.
        </h1>
        <p className={`${textMutedClass} max-w-[32rem]`}>
          Rafaela Andrade cria projetos residenciais, comerciais e interiores com escuta,
          proporcao e uma leitura cuidadosa de materiais, luz e rotina.
        </p>
        <div className="mt-5 grid w-full gap-3 sm:flex sm:flex-row sm:flex-wrap sm:items-center">
          <Link href="/projetos" className={`${buttonPrimaryClass} w-full sm:w-auto`}>
            ver portfolio <ArrowRight size={17} />
          </Link>
          <Link href="/contato" className={textLinkClass}>
            iniciar conversa
          </Link>
        </div>

        {slides.length > 1 ? (
          <div className="mt-7 flex flex-wrap items-center gap-2">
            {slides.map((project, index) => (
              <button
                key={project.id}
                type="button"
                aria-label={`Mostrar ${project.title}`}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "h-1.5 rounded-full transition",
                  index === activeIndex ? "w-8 bg-ink" : "w-4 bg-line hover:bg-muted"
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
