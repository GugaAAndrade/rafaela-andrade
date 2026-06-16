"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { LogOut, Plus, Save, Trash2 } from "lucide-react"
import type { ContactMessage, Feedback, Project } from "@/lib/types"
import {
  buttonGhostClass,
  buttonPrimaryClass,
  cn,
  eyebrowClass,
  fieldClass,
  inputClass,
  labelClass,
  panelClass,
  textareaClass,
  textMutedClass
} from "@/lib/ui"

type Tab = "projects" | "feedbacks" | "contacts"

const emptyProject = {
  id: "",
  slug: "",
  title: "",
  category: "Residencial",
  location: "",
  year: new Date().getFullYear().toString(),
  coverUrl: "",
  summary: "",
  description: "",
  imagesText: "",
  featured: true
}

const emptyFeedback = {
  id: "",
  clientName: "",
  role: "",
  quote: "",
  projectSlug: "",
  approved: true
}

const adminShellClass = "mx-auto w-[min(1240px,calc(100vw-20px))] md:w-[min(1240px,calc(100vw-40px))]"

export function AdminDashboard() {
  const [authorized, setAuthorized] = useState(false)
  const [password, setPassword] = useState("")
  const [loginStatus, setLoginStatus] = useState("")
  const [tab, setTab] = useState<Tab>("projects")
  const [projects, setProjects] = useState<Project[]>([])
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [contacts, setContacts] = useState<ContactMessage[]>([])
  const [projectForm, setProjectForm] = useState(emptyProject)
  const [feedbackForm, setFeedbackForm] = useState(emptyFeedback)
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const selectedProjectTitle = useMemo(
    () => (projectForm.id ? "Editar projeto" : "Novo projeto"),
    [projectForm.id]
  )

  useEffect(() => {
    fetch("/api/admin/session")
      .then((response) => response.json())
      .then((data) => {
        setAuthorized(Boolean(data.authorized))
        if (data.authorized) void loadAll()
      })
      .catch(() => setAuthorized(false))
  }, [])

  async function loadAll() {
    const [projectResponse, feedbackResponse, contactResponse] = await Promise.all([
      fetch("/api/projects"),
      fetch("/api/feedbacks?admin=1"),
      fetch("/api/contact")
    ])
    setProjects(await projectResponse.json())
    setFeedbacks(await feedbackResponse.json())
    setContacts(await contactResponse.json())
  }

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoginStatus("")
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    })
    if (!response.ok) {
      setLoginStatus("Senha invalida ou ADMIN_PASSWORD ausente.")
      return
    }
    setAuthorized(true)
    await loadAll()
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" })
    setAuthorized(false)
  }

  function editProject(project: Project) {
    setProjectForm({
      id: project.id,
      slug: project.slug,
      title: project.title,
      category: project.category,
      location: project.location,
      year: project.year,
      coverUrl: project.coverUrl,
      summary: project.summary,
      description: project.description,
      imagesText: project.images.join("\n"),
      featured: project.featured
    })
  }

  function editFeedback(feedback: Feedback) {
    setFeedbackForm({
      id: feedback.id,
      clientName: feedback.clientName,
      role: feedback.role,
      quote: feedback.quote,
      projectSlug: feedback.projectSlug || "",
      approved: feedback.approved
    })
  }

  async function saveProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setStatus("")

    const payload = {
      slug: projectForm.slug,
      title: projectForm.title,
      category: projectForm.category,
      location: projectForm.location,
      year: projectForm.year,
      coverUrl: projectForm.coverUrl,
      summary: projectForm.summary,
      description: projectForm.description,
      featured: projectForm.featured,
      images: projectForm.imagesText.split("\n").map((item) => item.trim()).filter(Boolean)
    }

    const url = projectForm.id ? `/api/projects/${projectForm.id}` : "/api/projects"
    const method = projectForm.id ? "PUT" : "POST"
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })

    await handleSaveResponse(response, "Projeto salvo.")
    setProjectForm(emptyProject)
    setLoading(false)
  }

  async function removeProject(id: string) {
    if (!confirm("Excluir este projeto?")) return
    const response = await fetch(`/api/projects/${id}`, { method: "DELETE" })
    await handleSaveResponse(response, "Projeto excluido.")
  }

  async function saveFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const response = await fetch("/api/feedbacks", {
      method: feedbackForm.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedbackForm)
    })
    await handleSaveResponse(response, "Feedback salvo.")
    setFeedbackForm(emptyFeedback)
    setLoading(false)
  }

  async function removeFeedback(id: string) {
    if (!confirm("Excluir este feedback?")) return
    const response = await fetch("/api/feedbacks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
    await handleSaveResponse(response, "Feedback excluido.")
  }

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setStatus("Enviando imagem...")
    const formData = new FormData()
    formData.append("file", file)
    const response = await fetch("/api/upload", { method: "POST", body: formData })
    const data = await response.json().catch(() => null)
    if (!response.ok) {
      setStatus(data?.error || "Nao foi possivel enviar a imagem.")
      return
    }
    const url = data.url as string
    setProjectForm((current) => ({
      ...current,
      coverUrl: current.coverUrl || url,
      imagesText: current.imagesText ? `${current.imagesText}\n${url}` : url
    }))
    setStatus("Imagem enviada e adicionada ao projeto.")
  }

  async function handleSaveResponse(response: Response, successMessage: string) {
    const data = await response.json().catch(() => null)
    if (!response.ok) {
      setStatus(data?.error || "Operacao nao concluida.")
      return
    }
    setStatus(successMessage)
    await loadAll()
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-paper px-4 py-6">
        <main className="grid min-h-[calc(100vh-48px)] place-items-center">
          <div className={cn(panelClass, "w-full max-w-[460px]")}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className={eyebrowClass}>Admin</p>
                <Image
                  src="/brand/rafaela-wordmark.png"
                  alt="Rafaela Andrade Arquitetura de Interiores"
                  width={897}
                  height={272}
                  className="h-auto w-[190px] object-contain"
                />
              </div>
            </div>
            <h1 className="mb-6 text-[clamp(2.4rem,7vw,3.4rem)] leading-none font-light tracking-[-0.03em]">
              Entrar
            </h1>
            <form className="grid gap-4" onSubmit={login}>
              <div className={fieldClass}>
                <label className={labelClass} htmlFor="password">Senha</label>
                <input
                  className={inputClass}
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <button className={`${buttonPrimaryClass} w-full`} type="submit">
                Entrar
              </button>
              <p className="min-h-6 text-sm text-ink/70">
                {loginStatus || "Em desenvolvimento, sem .env, use admin123."}
              </p>
            </form>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
        <nav className={`${adminShellClass} flex min-h-[72px] items-center justify-between gap-3 py-2`}>
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src="/brand/rafaela-wordmark.png"
              alt="Rafaela Andrade Arquitetura de Interiores"
              width={897}
              height={272}
              className="h-auto w-[132px] object-contain sm:w-[168px]"
            />
            <span className="hidden text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-muted sm:block">
              admin
            </span>
          </div>
          <button className={cn(buttonGhostClass, "shrink-0 px-3 sm:px-5")} type="button" onClick={logout}>
            <LogOut size={17} /> <span className="hidden sm:inline">Sair</span>
          </button>
        </nav>
      </header>

      <main className={`${adminShellClass} grid gap-5 py-5 md:py-7`}>
        <section className={cn(panelClass, "grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end")}>
          <div>
            <p className={eyebrowClass}>painel de conteudo</p>
            <h1 className="max-w-[680px] text-[clamp(1.8rem,8vw,4.35rem)] leading-[1.02] font-light tracking-[-0.03em]">
              Gerencie portfolio, feedbacks e contatos.
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <StatCard label="projetos" value={projects.length} />
            <StatCard label="feedbacks" value={feedbacks.length} />
            <StatCard label="contatos" value={contacts.length} />
          </div>
        </section>

        <div className="sticky top-[73px] z-20 flex overflow-x-auto rounded-md border border-line bg-soft/95 p-1 backdrop-blur">
          <TabButton active={tab === "projects"} onClick={() => setTab("projects")}>
            Projetos
          </TabButton>
          <TabButton active={tab === "feedbacks"} onClick={() => setTab("feedbacks")}>
            Feedbacks
          </TabButton>
          <TabButton active={tab === "contacts"} onClick={() => setTab("contacts")}>
            Contatos
          </TabButton>
        </div>

        {tab === "projects" && (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(360px,1.08fr)]">
            <section className={panelClass}>
              <div className="grid gap-1 border-b border-line pb-4">
                <p className={`${eyebrowClass} mb-0`}>editor</p>
                <h2 className="text-[clamp(1.45rem,2vw,2.05rem)] leading-[1.1] font-semibold">
                  {selectedProjectTitle}
                </h2>
              </div>
              <form className="mt-5 grid gap-4" onSubmit={saveProject}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Titulo" value={projectForm.title} onChange={(title) => setProjectForm({ ...projectForm, title })} />
                  <Field label="Slug" value={projectForm.slug} onChange={(slug) => setProjectForm({ ...projectForm, slug })} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Categoria" value={projectForm.category} onChange={(category) => setProjectForm({ ...projectForm, category })} />
                  <Field label="Local" value={projectForm.location} onChange={(location) => setProjectForm({ ...projectForm, location })} />
                  <Field label="Ano" value={projectForm.year} onChange={(year) => setProjectForm({ ...projectForm, year })} />
                </div>
                <Field label="Imagem principal" value={projectForm.coverUrl} onChange={(coverUrl) => setProjectForm({ ...projectForm, coverUrl })} />
                <div className={fieldClass}>
                  <label className={labelClass} htmlFor="upload">Upload local para public/uploads</label>
                  <input className={inputClass} id="upload" type="file" accept="image/*" onChange={uploadImage} />
                </div>
                <TextArea label="Resumo" value={projectForm.summary} onChange={(summary) => setProjectForm({ ...projectForm, summary })} />
                <TextArea label="Descricao" value={projectForm.description} onChange={(description) => setProjectForm({ ...projectForm, description })} />
                <TextArea required={false} label="Galeria, uma URL por linha" value={projectForm.imagesText} onChange={(imagesText) => setProjectForm({ ...projectForm, imagesText })} />
                <label className="flex items-center gap-3 text-sm font-semibold text-muted">
                  <input
                    className="h-4 w-4 rounded border-line text-ink focus:ring-black/10"
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(event) => setProjectForm({ ...projectForm, featured: event.target.checked })}
                  />
                  Destacar na home
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button className={buttonPrimaryClass} type="submit" disabled={loading}>
                    <Save size={17} /> Salvar projeto
                  </button>
                  <button className={buttonGhostClass} type="button" onClick={() => setProjectForm(emptyProject)}>
                    <Plus size={17} /> Limpar
                  </button>
                </div>
              </form>
            </section>

            <section className={panelClass}>
              <div className="grid gap-1 border-b border-line pb-4">
                <p className={`${eyebrowClass} mb-0`}>publicados</p>
                <h2 className="text-[clamp(1.45rem,2vw,2.05rem)] leading-[1.1] font-semibold">
                  Projetos cadastrados
                </h2>
              </div>
              <div className="mt-5 grid gap-3">
                {projects.map((project) => (
                  <article
                    className="flex flex-col gap-4 rounded-md border border-line bg-paper p-4 md:flex-row md:items-start md:justify-between"
                    key={project.id}
                  >
                    <div className="min-w-0">
                      <strong className="mb-1 block">{project.title}</strong>
                      <p className={textMutedClass}>{project.category} | {project.location}</p>
                    </div>
                    <div className="grid grid-cols-[minmax(0,1fr)_48px] gap-2 sm:flex">
                      <button className={cn(buttonGhostClass, "w-full")} onClick={() => editProject(project)} type="button">
                        Editar
                      </button>
                      <button
                        className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#9a2f24]/35 px-3 text-[#9a2f24] transition hover:bg-[#9a2f24]/5"
                        onClick={() => removeProject(project.id)}
                        type="button"
                        aria-label="Excluir"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {tab === "feedbacks" && (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(360px,1.08fr)]">
            <section className={panelClass}>
              <div className="grid gap-1 border-b border-line pb-4">
                <p className={`${eyebrowClass} mb-0`}>depoimentos</p>
                <h2 className="text-[clamp(1.45rem,2vw,2.05rem)] leading-[1.1] font-semibold">
                  {feedbackForm.id ? "Editar feedback" : "Novo feedback"}
                </h2>
              </div>
              <form className="mt-5 grid gap-4" onSubmit={saveFeedback}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Cliente" value={feedbackForm.clientName} onChange={(clientName) => setFeedbackForm({ ...feedbackForm, clientName })} />
                  <Field label="Contexto" value={feedbackForm.role} onChange={(role) => setFeedbackForm({ ...feedbackForm, role })} />
                </div>
                <Field required={false} label="Slug do projeto" value={feedbackForm.projectSlug} onChange={(projectSlug) => setFeedbackForm({ ...feedbackForm, projectSlug })} />
                <TextArea label="Depoimento" value={feedbackForm.quote} onChange={(quote) => setFeedbackForm({ ...feedbackForm, quote })} />
                <label className="flex items-center gap-3 text-sm font-semibold text-muted">
                  <input
                    className="h-4 w-4 rounded border-line text-ink focus:ring-black/10"
                    type="checkbox"
                    checked={feedbackForm.approved}
                    onChange={(event) => setFeedbackForm({ ...feedbackForm, approved: event.target.checked })}
                  />
                  Exibir no site
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button className={buttonPrimaryClass} type="submit">
                    <Save size={17} /> Salvar feedback
                  </button>
                </div>
              </form>
            </section>

            <section className={panelClass}>
              <div className="grid gap-1 border-b border-line pb-4">
                <p className={`${eyebrowClass} mb-0`}>visibilidade</p>
                <h2 className="text-[clamp(1.45rem,2vw,2.05rem)] leading-[1.1] font-semibold">
                  Feedbacks
                </h2>
              </div>
              <div className="mt-5 grid gap-3">
                {feedbacks.map((feedback) => (
                  <article
                    className="flex flex-col gap-4 rounded-md border border-line bg-paper p-4 md:flex-row md:items-start md:justify-between"
                    key={feedback.id}
                  >
                    <div className="min-w-0">
                      <strong className="mb-1 block">{feedback.clientName}</strong>
                      <p className={textMutedClass}>{feedback.quote}</p>
                    </div>
                    <div className="grid grid-cols-[minmax(0,1fr)_48px] gap-2 sm:flex">
                      <button className={cn(buttonGhostClass, "w-full")} onClick={() => editFeedback(feedback)} type="button">
                        Editar
                      </button>
                      <button
                        className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#9a2f24]/35 px-3 text-[#9a2f24] transition hover:bg-[#9a2f24]/5"
                        onClick={() => removeFeedback(feedback.id)}
                        type="button"
                        aria-label="Excluir"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {tab === "contacts" && (
          <section className={panelClass}>
            <div className="grid gap-1 border-b border-line pb-4">
              <p className={`${eyebrowClass} mb-0`}>inbox</p>
              <h2 className="text-[clamp(1.45rem,2vw,2.05rem)] leading-[1.1] font-semibold">
                Mensagens recebidas
              </h2>
            </div>
            <div className="mt-5 grid gap-3">
              {contacts.length === 0 && <p className={textMutedClass}>Sem mensagens salvas ainda.</p>}
              {contacts.map((contact) => (
                <article className="rounded-md border border-line bg-paper p-4" key={contact.id}>
                  <strong className="mb-1 block">{contact.name}</strong>
                  <p className={textMutedClass}>
                    {contact.email} {contact.phone ? `| ${contact.phone}` : ""}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap leading-7 text-ink">{contact.message}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <p className="min-h-6 text-sm text-ink/70">{status}</p>
      </main>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid gap-1 rounded-md border border-line bg-paper px-3 py-3 sm:px-4">
      <strong className="text-[1.3rem] leading-none sm:text-[1.55rem]">{value}</strong>
      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-muted sm:text-[0.72rem]">
        {label}
      </span>
    </div>
  )
}

function TabButton({
  active,
  children,
  onClick
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        "min-h-10 flex-1 rounded-md px-3 text-sm font-medium whitespace-nowrap transition sm:px-4",
        active ? "bg-ink text-white" : "text-muted hover:bg-black/5 hover:text-ink"
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

function Field({
  label,
  value,
  onChange,
  required = true
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-")
  return (
    <div className={fieldClass}>
      <label className={labelClass} htmlFor={id}>{label}</label>
      <input
        className={inputClass}
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </div>
  )
}

function TextArea({
  label,
  value,
  onChange,
  required = true
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-")
  return (
    <div className={fieldClass}>
      <label className={labelClass} htmlFor={id}>{label}</label>
      <textarea
        className={textareaClass}
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </div>
  )
}
