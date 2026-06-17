"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import type { Project } from "@/lib/types"
import {
  buttonGhostClass,
  cn,
  inputClass,
  shellClass,
  textMutedClass
} from "@/lib/ui"
import { ProjectCard } from "@/components/project-card"

export function ProjectsCatalog({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("todos")
  const [location, setLocation] = useState("todos")
  const [year, setYear] = useState("todos")

  const categories = useMemo(
    () => ["todos", ...new Set(projects.map((project) => project.category).filter(Boolean))],
    [projects]
  )

  const locations = useMemo(
    () => ["todos", ...new Set(projects.map((project) => project.location).filter(Boolean))],
    [projects]
  )

  const years = useMemo(
    () =>
      ["todos", ...new Set(projects.map((project) => project.year).filter(Boolean))].sort((a, b) =>
        a === "todos" ? -1 : b === "todos" ? 1 : Number(b) - Number(a)
      ),
    [projects]
  )

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesQuery =
        !normalizedQuery ||
        [project.title, project.summary, project.location, project.category, project.year]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)

      const matchesCategory = category === "todos" || project.category === category
      const matchesLocation = location === "todos" || project.location === location
      const matchesYear = year === "todos" || project.year === year

      return matchesQuery && matchesCategory && matchesLocation && matchesYear
    })
  }, [category, location, projects, query, year])

  return (
    <div className={`${shellClass} grid gap-6 md:gap-8`}>
      <div className="rounded-[8px] border border-line bg-white p-4 shadow-[0_20px_50px_rgba(32,33,29,0.06)] md:p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="grid gap-2">
            <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-muted">
              Buscar projeto
            </span>
            <span className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                className={cn(inputClass, "pl-10")}
                type="search"
                placeholder="Título, local, categoria ou ano"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </span>
          </label>

          <FilterSelect
            label="Categoria"
            value={category}
            options={categories}
            onChange={setCategory}
          />

          <FilterSelect
            label="Local"
            value={location}
            options={locations}
            onChange={setLocation}
          />

          <FilterSelect
            label="Ano"
            value={year}
            options={years}
            onChange={setYear}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className={textMutedClass}>
            {filteredProjects.length} {filteredProjects.length === 1 ? "projeto encontrado" : "projetos encontrados"}
          </p>
          <button
            className={cn(buttonGhostClass, "w-full sm:w-fit")}
            type="button"
            onClick={() => {
              setQuery("")
              setCategory("todos")
              setLocation("todos")
              setYear("todos")
            }}
          >
            Limpar filtros
          </button>
        </div>
      </div>

      {filteredProjects.length ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 md:gap-5 xl:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="grid min-h-[280px] place-items-center rounded-[8px] border border-dashed border-line bg-soft px-6 py-12 text-center">
          <div className="grid max-w-[28rem] gap-3">
            <strong className="text-[1.15rem] font-medium text-ink">Nenhum projeto encontrado</strong>
            <p className={textMutedClass}>
              Ajuste a busca ou remova um dos filtros para ver novamente a seleção completa.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-muted">{label}</span>
      <select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "todos" ? "Todos" : option}
          </option>
        ))}
      </select>
    </label>
  )
}
