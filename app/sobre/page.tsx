import { ArrowRight, DraftingCompass, Layers3, Ruler } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { SiteHeader } from "@/components/site-header"
import {
  buttonPrimaryClass,
  eyebrowClass,
  pageMainClass,
  sectionClass,
  shellClass,
  textMutedClass
} from "@/lib/ui"

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className={pageMainClass}>
        <section className={sectionClass}>
          <div className={`${shellClass} grid gap-8 lg:grid-cols-[minmax(160px,0.35fr)_minmax(0,1fr)] lg:gap-16`}>
            <aside className="grid gap-3 border-t border-line pt-4 text-sm text-muted lg:sticky lg:top-8 lg:self-start">
              <p className={`${eyebrowClass} mb-0`}>sobre o estúdio</p>
              <span>Arquitetura residencial, interiores e acompanhamento de obra.</span>
            </aside>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.48fr)] lg:items-end">
              <h1 className="max-w-[720px] text-[clamp(2rem,8vw,4.6rem)] leading-[1.02] font-light tracking-[-0.03em] text-ink">
                Entre o desenho e a obra, cada escolha precisa melhorar a forma como o espaço é usado.
              </h1>
              <div className="grid gap-4 text-[0.98rem] leading-7 text-muted">
                <p>
                  O processo comeca pela rotina do cliente e pelo potencial do lugar. A partir disso,
                  o projeto organiza luz, circulação, armazenamento, materialidade e permanência.
                </p>
                <p>
                  A linguagem visual e silenciosa, mas nunca neutra: texturas naturais, volumes claros e
                  detalhes executáveis para que a obra preserve a intenção original.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={`${sectionClass} bg-soft`}>
          <div className={`${shellClass} grid gap-7 lg:grid-cols-[minmax(300px,0.82fr)_minmax(0,1fr)] lg:items-center`}>
            <img
              className="h-[280px] rounded-md object-cover sm:h-[360px] md:aspect-[16/10] md:h-auto lg:h-[clamp(420px,48vw,640px)] lg:aspect-auto"
              src="https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1400&q=84"
              alt="Interior com madeira clara, concreto e luz natural"
            />
            <div>
              <p className={eyebrowClass}>forma de trabalho</p>
              <h2 className="mb-8 text-[clamp(2.1rem,3.7vw,4.45rem)] leading-[1.05] font-light tracking-[-0.03em]">
                Projetar e acompanhar para que a obra chegue perto da intenção inicial.
              </h2>
              <div className="grid">
                <article className="grid grid-cols-[30px_minmax(0,1fr)] gap-4 border-t border-line py-5">
                  <DraftingCompass className="text-muted" size={24} />
                  <div>
                    <h3 className="mb-2 text-[1.05rem] font-semibold">Escuta e programa</h3>
                    <p className={textMutedClass}>Leitura da rotina, prioridades, medidas e restrições reais.</p>
                  </div>
                </article>
                <article className="grid grid-cols-[30px_minmax(0,1fr)] gap-4 border-t border-line py-5">
                  <Layers3 className="text-muted" size={24} />
                  <div>
                    <h3 className="mb-2 text-[1.05rem] font-semibold">Conceito material</h3>
                    <p className={textMutedClass}>Definição de paleta, luz, volumes e relação entre ambientes.</p>
                  </div>
                </article>
                <article className="grid grid-cols-[30px_minmax(0,1fr)] gap-4 border-t border-line py-5">
                  <Ruler className="text-muted" size={24} />
                  <div>
                    <h3 className="mb-2 text-[1.05rem] font-semibold">Detalhamento</h3>
                    <p className={textMutedClass}>Desenhos executivos, compatibilizações e apoio para decisão de obra.</p>
                  </div>
                </article>
              </div>
              <Link href="/contato" className={`${buttonPrimaryClass} mt-7`}>
                iniciar projeto <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
