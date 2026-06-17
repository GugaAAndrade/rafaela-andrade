import { Footer } from "@/components/footer"
import { ProjectsCatalog } from "@/components/projects-catalog"
import { SiteHeader } from "@/components/site-header"
import { listProjects } from "@/lib/data"
import { eyebrowClass, pageMainClass, sectionClass, shellClass, textMutedClass } from "@/lib/ui"

export const dynamic = "force-dynamic"

export default async function ProjectsPage() {
  const projects = await listProjects()

  return (
    <>
      <SiteHeader />
      <main className={pageMainClass}>
        <section className="grid min-h-[30vh] items-end border-b border-line bg-soft py-12 md:min-h-[38vh] md:py-16 xl:py-20">
          <div className={shellClass}>
            <p className={eyebrowClass}>Portfólio</p>
            <h1 className="max-w-[920px] text-[clamp(2rem,8vw,5.6rem)] leading-[0.98] font-light tracking-[-0.03em]">
              Projetos construídos a partir de contexto, luz e uso.
            </h1>
            <p className={`${textMutedClass} max-w-[38rem]`}>
              Uma seleção de residências, reformas e espaços comerciais com ficha, imagens e decisões de projeto.
            </p>
          </div>
        </section>
        <section className={sectionClass}>
          <ProjectsCatalog projects={projects} />
        </section>
      </main>
      <Footer />
    </>
  )
}
