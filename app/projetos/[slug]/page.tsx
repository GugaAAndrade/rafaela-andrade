import { notFound } from "next/navigation"
import { Footer } from "@/components/footer"
import { SiteHeader } from "@/components/site-header"
import { getProjectBySlug } from "@/lib/data"
import { eyebrowClass, pageMainClass, sectionClass, shellClass } from "@/lib/ui"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  return (
    <>
      <SiteHeader />
      <main className={pageMainClass}>
        <section className="relative grid min-h-[58svh] items-end bg-ink text-white md:min-h-[74svh]">
          <img
            className="absolute inset-0 h-full w-full object-cover opacity-65"
            src={project.coverUrl}
            alt={`Imagem principal do projeto ${project.title}`}
          />
          <div className={`${shellClass} relative z-10 pb-8 md:pb-16`}>
            <p className={`${eyebrowClass} text-white/80`}>{project.category}</p>
            <h1 className="max-w-[900px] text-[clamp(2.1rem,9vw,5.8rem)] leading-[0.95] font-light tracking-[-0.03em]">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-3 text-sm font-semibold text-white/80">
              <span>{project.location}</span>
              <span>{project.year}</span>
            </div>
          </div>
        </section>
        <section className={sectionClass}>
          <div className={`${shellClass} grid gap-10 lg:grid-cols-[0.45fr_1fr]`}>
            <aside>
              <dl className="grid gap-4 rounded-md border border-line bg-soft p-4 lg:sticky lg:top-8 lg:border-0 lg:bg-transparent lg:p-0">
                <div className="flex justify-between gap-4 border-b border-line pb-3">
                  <dt className="text-muted">Local</dt>
                  <dd>{project.location}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-line pb-3">
                  <dt className="text-muted">Ano</dt>
                  <dd>{project.year}</dd>
                </div>
              </dl>
            </aside>
            <article>
              <p className="max-w-[720px] text-[clamp(1.45rem,6vw,3.2rem)] leading-[1.08] font-light tracking-[-0.03em] text-ink">
                {project.summary}
              </p>
              <p className="mt-6 text-[clamp(1.02rem,4.2vw,1.8rem)] leading-[1.55] font-light tracking-[-0.02em] text-ink md:mt-8 md:leading-[1.28]">
                {project.description}
              </p>
            </article>
          </div>
        </section>
        <section className={`${sectionClass} bg-soft`}>
          <div className={`${shellClass} grid gap-3 md:grid-cols-12`}>
            {[project.coverUrl, ...project.images].map((image, index) => (
              <img
                className={
                  index % 3 === 0
                    ? "h-[240px] rounded-md object-cover sm:h-[320px] md:col-span-8 md:h-[52vw] md:max-h-[620px]"
                    : "h-[240px] rounded-md object-cover sm:h-[320px] md:col-span-4 md:h-[52vw] md:max-h-[620px]"
                }
                key={image}
                src={image}
                alt={`Imagem do projeto ${project.title}`}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
