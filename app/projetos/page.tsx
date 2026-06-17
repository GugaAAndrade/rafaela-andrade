import { Footer } from "@/components/footer"
import { ProjectCard } from "@/components/project-card"
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
            <p className={eyebrowClass}>Portfolio</p>
            <h1 className="max-w-[920px] text-[clamp(2rem,8vw,5.6rem)] leading-[0.98] font-light tracking-[-0.03em]">
              Projetos construidos a partir de contexto, luz e uso.
            </h1>
            <p className={`${textMutedClass} max-w-[38rem]`}>
              Uma selecao de residencias, reformas e espacos comerciais com ficha, imagens e decisoes de projeto.
            </p>
          </div>
        </section>
        <section className={sectionClass}>
          <div className={`${shellClass} grid gap-3 md:grid-cols-2 lg:grid-cols-6`}>
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                className={
                  index % 3 === 0 ? "lg:col-span-4" : index % 3 === 1 ? "lg:col-span-2" : "lg:col-span-3"
                }
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
