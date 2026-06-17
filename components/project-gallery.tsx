"use client"

import { useMemo, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { buttonGhostClass, cn, shellClass } from "@/lib/ui"

export function ProjectGallery({
  title,
  images
}: {
  title: string
  images: string[]
}) {
  const gallery = useMemo(() => Array.from(new Set(images.filter(Boolean))), [images])
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!gallery.length) return null

  const selectedImage = gallery[selectedIndex] || gallery[0]

  function showPrevious() {
    setSelectedIndex((current) => (current === 0 ? gallery.length - 1 : current - 1))
  }

  function showNext() {
    setSelectedIndex((current) => (current === gallery.length - 1 ? 0 : current + 1))
  }

  return (
    <section className="bg-soft py-12 md:py-20 xl:py-24">
      <div className={`${shellClass} grid gap-6 xl:gap-8`}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="grid gap-2">
            <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-muted">
              Galeria do projeto
            </p>
            <h2 className="text-[clamp(1.7rem,4vw,3rem)] leading-[1.02] font-light tracking-[-0.03em] text-ink">
              Imagens selecionadas para {title}
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-muted">
            <span>{selectedIndex + 1}</span>
            <span>/</span>
            <span>{gallery.length}</span>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-6">
          <div className="grid gap-4">
            <div className="relative overflow-hidden rounded-[8px] border border-line bg-white shadow-[0_24px_64px_rgba(32,33,29,0.08)] xl:h-[min(68vh,760px)]">
              <img
                className="block aspect-[16/11] w-full object-cover xl:h-full xl:aspect-auto"
                src={selectedImage}
                alt={`Imagem ampliada do projeto ${title}`}
              />
              {gallery.length > 1 ? (
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                  <button
                    className={cn(buttonGhostClass, "border-white/35 bg-white/12 px-3 text-white backdrop-blur-sm hover:bg-white/18")}
                    type="button"
                    onClick={showPrevious}
                    aria-label="Imagem anterior"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    className={cn(buttonGhostClass, "border-white/35 bg-white/12 px-3 text-white backdrop-blur-sm hover:bg-white/18")}
                    type="button"
                    onClick={showNext}
                    aria-label="Proxima imagem"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 overflow-x-hidden overflow-y-auto xl:max-h-[min(68vh,760px)] xl:grid-cols-2 xl:content-start xl:pr-1">
            {gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
                className={cn(
                  "group overflow-hidden rounded-[8px] border bg-white text-left shadow-[0_14px_34px_rgba(32,33,29,0.05)] transition",
                  selectedIndex === index ? "border-ink" : "border-line hover:border-ink/30"
                )}
                type="button"
                onClick={() => setSelectedIndex(index)}
              >
                <img
                  className="block aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  src={image}
                  alt={`Miniatura ${index + 1} do projeto ${title}`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
