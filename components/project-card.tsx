import Link from "next/link"
import type { Project } from "@/lib/types"
import { cn } from "@/lib/ui"

export function ProjectCard({
  project,
  className,
  imageAspectClass = "aspect-[4/5]"
}: {
  project: Project
  className?: string
  imageAspectClass?: string
}) {
  return (
    <Link
      className={cn(
        "group grid overflow-hidden rounded-[8px] border border-line bg-white shadow-[0_20px_50px_rgba(32,33,29,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(32,33,29,0.1)]",
        className
      )}
      href={`/projetos/${project.slug}`}
    >
      <div className={cn("relative overflow-hidden bg-soft", imageAspectClass)}>
        {project.coverUrl ? (
          <img
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
            src={project.coverUrl}
            alt={`Imagem principal do projeto ${project.title}`}
          />
        ) : (
          <div className="grid h-full place-items-center bg-soft text-muted">Sem imagem</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-black/18 to-transparent opacity-90 transition group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-4 md:p-5">
          <span className="inline-flex items-center rounded-full bg-white/14 px-2.5 py-1 text-[0.66rem] font-extrabold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
            {project.category}
          </span>
          <span className="inline-flex items-center rounded-full bg-white/14 px-2.5 py-1 text-[0.66rem] font-extrabold uppercase tracking-[0.12em] text-white/90 backdrop-blur-sm">
            {project.year}
          </span>
        </div>
      </div>

      <div className="grid gap-3 px-4 py-4 md:px-5 md:py-5">
        <div className="grid gap-2">
          <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-muted">
            {project.location || "Projeto autoral"}
          </p>
          <h3 className="text-[1.2rem] leading-[1.02] font-light tracking-[-0.03em] text-ink sm:text-[1.35rem]">
            {project.title}
          </h3>
        </div>
        <p className="line-clamp-3 text-[0.94rem] leading-6 text-muted md:text-[0.98rem]">
          {project.summary}
        </p>
      </div>
    </Link>
  )
}
