import Link from "next/link"
import { ArrowRight, DraftingCompass, Layers3, Ruler } from "lucide-react"
import { Footer } from "@/components/footer"
import { HomeHero } from "@/components/home-hero"
import { ProjectCard } from "@/components/project-card"
import { SiteHeader } from "@/components/site-header"
import { listFeedbacks, listProjects } from "@/lib/data"
import {
  buttonPrimaryClass,
  eyebrowClass,
  pageMainClass,
  sectionClass,
  shellClass,
  textLinkClass,
  textMutedClass
} from "@/lib/ui"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [projects, feedbacks] = await Promise.all([listProjects(), listFeedbacks()])
  const featured = projects.filter((project) => project.featured).slice(0, 4)
  const heroProjects = featured.length
    ? [...featured, ...projects.filter((project) => !featured.some((item) => item.id === project.id))]
    : projects
  const primaryFeatured = featured[0]
  const secondaryFeatured = featured.slice(1)

  return (
    <>
      <SiteHeader />
      <main className={pageMainClass}>
        <HomeHero projects={heroProjects} />

        <section className={sectionClass}>
          <div className={shellClass}>
            <div className="mb-9 grid items-end gap-5 md:grid-cols-[minmax(120px,0.24fr)_minmax(0,1fr)_auto]">
              <p className={`${eyebrowClass} mb-0`}>portfolio</p>
              <h2 className="max-w-[760px] text-[clamp(2.1rem,3.7vw,4.45rem)] leading-[1.05] font-light tracking-[-0.03em]">
                Projetos selecionados
              </h2>
              <Link href="/projetos" className={textLinkClass}>
                todos os projetos <ArrowRight size={16} />
              </Link>
            </div>
            {primaryFeatured ? (
              <div className="grid gap-4 md:gap-5">
                <ProjectCard
                  project={primaryFeatured}
                  imageAspectClass="aspect-[16/12] md:aspect-[16/9] xl:aspect-[16/8.5]"
                />

                {secondaryFeatured.length ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {secondaryFeatured.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        imageAspectClass="aspect-[4/3] sm:aspect-[4/3] xl:aspect-[5/4]"
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>

        <section className={`${sectionClass} bg-soft`}>
          <div className={`${shellClass} grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.72fr)]`}>
            <div>
              <p className={eyebrowClass}>processo</p>
              <h2 className="max-w-[780px] text-[clamp(2.1rem,3.7vw,4.45rem)] leading-[1.05] font-light tracking-[-0.03em]">
                Um metodo enxuto para reduzir ruido entre ideia, desenho e execucao.
              </h2>
            </div>
            <div className="grid">
              <article className="grid grid-cols-[30px_minmax(0,1fr)] gap-4 border-t border-line py-5">
                <DraftingCompass className="text-muted" size={24} />
                <div>
                  <h3 className="mb-2 text-[1.05rem] font-semibold">Leitura inicial</h3>
                  <p className={textMutedClass}>Briefing, medidas, referencias e prioridades de uso.</p>
                </div>
              </article>
              <article className="grid grid-cols-[30px_minmax(0,1fr)] gap-4 border-t border-line py-5">
                <Layers3 className="text-muted" size={24} />
                <div>
                  <h3 className="mb-2 text-[1.05rem] font-semibold">Conceito e materialidade</h3>
                  <p className={textMutedClass}>Solucoes espaciais, paleta, luz e compatibilizacao visual.</p>
                </div>
              </article>
              <article className="grid grid-cols-[30px_minmax(0,1fr)] gap-4 border-t border-line py-5">
                <Ruler className="text-muted" size={24} />
                <div>
                  <h3 className="mb-2 text-[1.05rem] font-semibold">Projeto executivo</h3>
                  <p className={textMutedClass}>Detalhamento para obra, marcenaria e tomadas de decisao.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className={sectionClass} id="feedbacks">
          <div className={shellClass}>
            <div className="mb-9 grid gap-5">
              <p className={`${eyebrowClass} mb-0`}>feedbacks</p>
              <h2 className="text-[clamp(2.1rem,3.7vw,4.1rem)] leading-[1.05] font-light tracking-[-0.03em]">
                O que fica depois da entrega.
              </h2>
            </div>
            <div className="grid border-t border-line md:grid-cols-3 md:border-l">
              {feedbacks.slice(0, 3).map((feedback) => (
                <article
                  className="flex min-h-[260px] flex-col justify-between border-b border-line px-5 py-6 md:border-r md:px-7"
                  key={feedback.id}
                >
                  <p className="text-[clamp(1.25rem,1.75vw,1.8rem)] leading-[1.22] font-light tracking-[-0.025em] text-ink">
                    "{feedback.quote}"
                  </p>
                  <div>
                    <strong>{feedback.clientName}</strong>
                    <p className={textMutedClass}>{feedback.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={`${sectionClass} bg-soft text-ink`}>
          <div className={`${shellClass} flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center`}>
            <p className="max-w-[760px] text-[clamp(2rem,3.2vw,3.9rem)] leading-[1.02] font-light tracking-[-0.03em]">
              tem um terreno, uma reforma ou um ambiente para transformar?
            </p>
            <Link
              href="/contato"
              className={buttonPrimaryClass}
            >
              falar com o estudio <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
