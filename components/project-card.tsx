import Link from "next/link"
import type { Project } from "@/lib/types"
import { cn } from "@/lib/ui"

export function ProjectCard({ project, className }: { project: Project; className?: string }) {
  return (
    <Link
      className={cn(
        "group relative min-h-[280px] overflow-hidden rounded-md bg-ink text-white sm:min-h-[320px] lg:min-h-[420px]",
        className
      )}
      href={`/projetos/${project.slug}`}
    >
      <img
        className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-60"
        src={project.coverUrl}
        alt={`Imagem principal do projeto ${project.title}`}
      />
      <div className="absolute inset-x-0 bottom-0 grid gap-3 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-5 md:p-6">
        <div className="flex flex-wrap gap-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-white/80">
          <span>{project.category}</span>
          <span>{project.location}</span>
          <span>{project.year}</span>
        </div>
        <h3 className="text-[1.35rem] leading-[0.98] font-light tracking-[-0.03em] sm:text-[1.6rem] md:text-[2.4rem]">
          {project.title}
        </h3>
        <p className="max-w-[52ch] text-[0.92rem] leading-6 text-white/80 md:text-[0.98rem]">
          {project.summary}
        </p>
      </div>
    </Link>
  )
}
