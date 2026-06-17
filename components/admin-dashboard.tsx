"use client"

import Image from "next/image"
import { useEffect, useId, useMemo, useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderOpen,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Plus,
  Save,
  Sparkles,
  Star,
  Trash2,
  Upload
} from "lucide-react"
import type { ContactMessage, Feedback, Project } from "@/lib/types"
import {
  buttonGhostClass,
  buttonPrimaryClass,
  cn,
  eyebrowClass,
  fieldClass,
  inputClass,
  labelClass,
  textareaClass,
  textMutedClass
} from "@/lib/ui"

type Tab = "overview" | "projects" | "feedbacks" | "contacts"

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

const adminShellClass = "mx-auto w-[min(1480px,calc(100vw-16px))] md:w-[min(1480px,calc(100vw-32px))]"

const tabMeta: Record<
  Tab,
  { label: string; title: string; description: string; icon: LucideIcon }
> = {
  overview: {
    label: "Painel",
    title: "Painel do estudio",
    description: "Visao geral do conteudo, contatos recentes e andamento do portfolio.",
    icon: LayoutDashboard
  },
  projects: {
    label: "Projetos",
    title: "Projetos",
    description: "Cadastre, revise e organize a apresentacao dos projetos publicados.",
    icon: FolderOpen
  },
  feedbacks: {
    label: "Feedbacks",
    title: "Feedbacks",
    description: "Gerencie depoimentos aprovados e o contexto de cada entrega.",
    icon: MessageSquare
  },
  contacts: {
    label: "Contatos",
    title: "Mensagens",
    description: "Acompanhe novos contatos e centralize a triagem comercial.",
    icon: Inbox
  }
}

export function AdminDashboard() {
  const [authorized, setAuthorized] = useState(false)
  const [password, setPassword] = useState("")
  const [loginStatus, setLoginStatus] = useState("")
  const [tab, setTab] = useState<Tab>("overview")
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

  const currentDateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", {
        day: "numeric",
        month: "long"
      }).format(new Date()),
    []
  )

  const projectImages = useMemo(() => {
    const gallery = projectForm.imagesText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)

    return Array.from(new Set([projectForm.coverUrl, ...gallery].filter(Boolean)))
  }, [projectForm.coverUrl, projectForm.imagesText])

  const approvedFeedbacks = useMemo(
    () => feedbacks.filter((feedback) => feedback.approved).length,
    [feedbacks]
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
      setLoginStatus("Senha invalida.")
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
    setTab("projects")
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
    setTab("feedbacks")
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
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    setLoading(true)
    setStatus(files.length > 1 ? `Enviando ${files.length} imagens...` : "Enviando imagem...")

    const uploadedUrls: string[] = []

    for (const [index, file] of files.entries()) {
      setStatus(
        files.length > 1 ? `Enviando imagem ${index + 1} de ${files.length}...` : "Enviando imagem..."
      )

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setLoading(false)
        setStatus(data?.error || "Nao foi possivel enviar a imagem.")
        event.target.value = ""
        return
      }

      const url = (data?.secureUrl || data?.url) as string | undefined

      if (!url) {
        setLoading(false)
        setStatus("Upload concluido sem URL valida retornada.")
        event.target.value = ""
        return
      }

      uploadedUrls.push(url)
    }

    setProjectForm((current) => ({
      ...current,
      coverUrl: current.coverUrl || uploadedUrls[0] || "",
      imagesText: [current.imagesText, ...uploadedUrls].filter(Boolean).join("\n")
    }))
    setLoading(false)
    setStatus(
      uploadedUrls.length > 1
        ? `${uploadedUrls.length} imagens enviadas e adicionadas ao projeto.`
        : "Imagem enviada e adicionada ao projeto."
    )
    event.target.value = ""
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
      <div className="min-h-screen bg-[#f5f3ee] px-3 py-3 md:px-4 md:py-4">
        <main className={`${adminShellClass} grid min-h-[calc(100vh-24px)] place-items-center`}>
          <div className="grid w-full max-w-[1080px] overflow-hidden rounded-[28px] border border-line bg-paper shadow-[0_28px_80px_rgba(32,33,29,0.08)] lg:grid-cols-[320px_minmax(0,1fr)]">
            <section className="flex flex-col justify-between bg-ink px-6 py-7 text-white md:px-8 md:py-9">
              <div className="grid gap-8">
                <div className="grid gap-5">
                  <Image
                    src="/brand/rafaela-wordmark.png"
                    alt="Rafaela Andrade Arquitetura de Interiores"
                    width={897}
                    height={272}
                    className="h-auto w-[170px] object-contain brightness-[1.9] invert"
                  />
                  <div className="grid gap-2 text-white/72">
                    <p className="text-[0.74rem] font-extrabold uppercase tracking-[0.16em]">
                      Painel administrativo
                    </p>
                    <p className="max-w-[20rem] text-sm leading-6">
                      Controle o portfolio, receba novas mensagens e mantenha a apresentacao do estudio alinhada.
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <LoginFeature icon={FolderOpen} text="Projetos e capas" />
                  <LoginFeature icon={MessageSquare} text="Feedbacks aprovados" />
                  <LoginFeature icon={Inbox} text="Triagem de contatos" />
                </div>
              </div>
            </section>

            <section className="grid gap-8 px-5 py-6 md:px-8 md:py-9">
              <div className="grid gap-3">
                <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.14em] text-muted">
                  acesso restrito
                </p>
                <h1 className="text-[clamp(2.2rem,5vw,4.1rem)] leading-[0.95] font-light tracking-[-0.03em]">
                  Entrar no admin
                </h1>
                <p className="max-w-[34rem] text-[0.98rem] leading-7 text-muted">
                  Use a senha configurada para editar conteudo, atualizar as capas dos projetos e acompanhar novas mensagens.
                </p>
              </div>

              <form className="grid max-w-[420px] gap-5" onSubmit={login}>
                <div className={fieldClass}>
                  <label className={labelClass} htmlFor="password">Senha</label>
                  <input
                    className={inputClass}
                    id="password"
                    type="password"
                    value={password}
                    placeholder="Digite a senha do admin"
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
                <button className={`${buttonPrimaryClass} w-full sm:w-fit`} type="submit">
                  Acessar painel
                </button>
                <p className={cn("min-h-6 text-sm", loginStatus ? "text-[#9a2f24]" : "text-transparent")}>
                  {loginStatus || "."}
                </p>
              </form>
            </section>
          </div>
        </main>
      </div>
    )
  }

  const activeMeta = tabMeta[tab]

  return (
    <div className="min-h-screen bg-[#f5f3ee] px-3 py-3 md:px-4 md:py-4">
      <div className={`${adminShellClass} flex min-h-[calc(100vh-24px)] gap-4`}>
        <aside className="hidden w-[272px] shrink-0 rounded-[28px] bg-ink p-5 text-white shadow-[0_28px_80px_rgba(32,33,29,0.18)] lg:flex lg:flex-col lg:justify-between">
          <div className="grid gap-8">
            <Image
              src="/brand/rafaela-wordmark.png"
              alt="Rafaela Andrade Arquitetura de Interiores"
              width={897}
              height={272}
              className="h-auto w-[152px] object-contain brightness-[1.9] invert"
            />
            <nav className="grid gap-1" aria-label="Navegacao do admin">
              {(Object.keys(tabMeta) as Tab[]).map((item) => (
                <SidebarButton
                  key={item}
                  active={tab === item}
                  icon={tabMeta[item].icon}
                  label={tabMeta[item].label}
                  onClick={() => setTab(item)}
                />
              ))}
            </nav>
          </div>

          <button
            className="inline-flex min-h-11 items-center gap-3 rounded-2xl px-4 text-sm font-medium text-white/72 transition hover:bg-white/8 hover:text-white"
            type="button"
            onClick={logout}
          >
            <LogOut size={17} />
            Sair
          </button>
        </aside>

        <div className="flex-1 overflow-hidden rounded-[28px] border border-line bg-paper shadow-[0_28px_80px_rgba(32,33,29,0.08)]">
          <header className="border-b border-line px-4 py-4 md:px-8 md:py-7">
            <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
              <Image
                src="/brand/rafaela-wordmark.png"
                alt="Rafaela Andrade Arquitetura de Interiores"
                width={897}
                height={272}
                className="h-auto w-[148px] object-contain"
              />
              <button className={cn(buttonGhostClass, "shrink-0")} type="button" onClick={logout}>
                <LogOut size={17} />
              </button>
            </div>

            <div className="mb-4 overflow-x-auto lg:hidden">
              <div className="flex min-w-max gap-2 rounded-2xl border border-line bg-soft p-1">
                {(Object.keys(tabMeta) as Tab[]).map((item) => (
                  <MobileTabButton
                    key={item}
                    active={tab === item}
                    icon={tabMeta[item].icon}
                    label={tabMeta[item].label}
                    onClick={() => setTab(item)}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="grid gap-3">
                <div className="inline-flex items-center gap-2 text-sm text-muted">
                  <activeMeta.icon size={16} />
                  <span>{activeMeta.label}</span>
                </div>
                <div className="grid gap-2">
                  <h1 className="text-[clamp(2rem,4vw,3.65rem)] leading-[0.96] font-light tracking-[-0.03em] text-ink">
                    {activeMeta.title}
                  </h1>
                  <p className="max-w-[46rem] text-[0.98rem] leading-7 text-muted">
                    {activeMeta.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-line bg-soft px-4 py-2 text-sm text-muted">
                  <CalendarDays size={16} />
                  <span>{currentDateLabel}</span>
                </div>
                {tab === "projects" ? (
                  <button
                    className={buttonPrimaryClass}
                    type="button"
                    onClick={() => setProjectForm(emptyProject)}
                  >
                    <Plus size={17} />
                    novo projeto
                  </button>
                ) : null}
              </div>
            </div>
          </header>

          <main className="grid gap-6 p-4 md:p-8">
            {status ? (
              <div className="rounded-2xl border border-line bg-soft px-4 py-3 text-sm text-ink/72">
                {status}
              </div>
            ) : null}

            {tab === "overview" ? (
              <div className="grid gap-6">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <OverviewMetric
                    icon={FolderOpen}
                    label="Projetos"
                    value={projects.length}
                    note={`${projects.filter((project) => project.featured).length} em destaque`}
                  />
                  <OverviewMetric
                    icon={MessageSquare}
                    label="Feedbacks"
                    value={feedbacks.length}
                    note={`${approvedFeedbacks} publicados`}
                  />
                  <OverviewMetric
                    icon={Inbox}
                    label="Mensagens"
                    value={contacts.length}
                    note={contacts.length ? "novos contatos no inbox" : "nenhuma mensagem ainda"}
                  />
                  <OverviewMetric
                    icon={Star}
                    label="Capa ativa"
                    value={projects.filter((project) => project.coverUrl).length}
                    note="projetos com imagem principal"
                  />
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
                  <SurfaceCard
                    title="Mensagens recentes"
                    subtitle="Ultimos contatos recebidos pelo formulario do site."
                    actionLabel={contacts.length ? "ver inbox" : undefined}
                    onAction={contacts.length ? () => setTab("contacts") : undefined}
                  >
                    <div className="grid gap-3">
                      {contacts.length === 0 ? (
                        <EmptyState
                          icon={Inbox}
                          title="Sem mensagens"
                          description="Quando alguem enviar contato pelo site, ele aparece aqui."
                        />
                      ) : (
                        contacts.slice(0, 4).map((contact) => (
                          <ListRow
                            key={contact.id}
                            title={contact.name}
                            subtitle={contact.message}
                            meta={formatContactMeta(contact)}
                            icon={Mail}
                          />
                        ))
                      )}
                    </div>
                  </SurfaceCard>

                  <SurfaceCard
                    title="Projetos recentes"
                    subtitle="Acompanhe o portfolio mais novo e revise capas rapidamente."
                    actionLabel={projects.length ? "editar projeto" : undefined}
                    onAction={projects.length ? () => setTab("projects") : undefined}
                  >
                    <div className="grid gap-3">
                      {projects.length === 0 ? (
                        <EmptyState
                          icon={FolderOpen}
                          title="Sem projetos"
                          description="Crie o primeiro projeto para alimentar a home e as paginas internas."
                        />
                      ) : (
                        projects.slice(0, 4).map((project) => (
                          <ProjectRow key={project.id} project={project} onEdit={() => editProject(project)} />
                        ))
                      )}
                    </div>
                  </SurfaceCard>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,1fr)]">
                  <SurfaceCard
                    title="Feedbacks publicados"
                    subtitle="Depoimentos ativos usados no site."
                    actionLabel={feedbacks.length ? "gerenciar" : undefined}
                    onAction={feedbacks.length ? () => setTab("feedbacks") : undefined}
                  >
                    <div className="grid gap-3">
                      {feedbacks.length === 0 ? (
                        <EmptyState
                          icon={MessageSquare}
                          title="Sem feedbacks"
                          description="Cadastre depoimentos para reforcar confianca nas paginas publicas."
                        />
                      ) : (
                        feedbacks.slice(0, 3).map((feedback) => (
                          <QuoteCard key={feedback.id} feedback={feedback} onEdit={() => editFeedback(feedback)} />
                        ))
                      )}
                    </div>
                  </SurfaceCard>

                  <SurfaceCard
                    title="Projeto em destaque"
                    subtitle="Resumo rapido do item que aparece na home."
                  >
                    {projects.find((project) => project.featured) ? (
                      <HeroProjectCard project={projects.find((project) => project.featured)!} />
                    ) : (
                      <EmptyState
                        icon={Star}
                        title="Nenhum destaque selecionado"
                        description="Marque um projeto como destaque para puxar a home com mais clareza."
                      />
                    )}
                  </SurfaceCard>
                </div>
              </div>
            ) : null}

            {tab === "projects" ? (
              <div className="grid gap-6">
                <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.05fr)]">
                  <SurfaceCard title="Projeto em edicao" subtitle="Resumo visual antes de salvar.">
                    <div className="grid gap-5">
                      <div className="overflow-hidden rounded-[22px] border border-line bg-soft">
                        {projectForm.coverUrl ? (
                          <img
                            className="h-[240px] w-full object-cover"
                            src={projectForm.coverUrl}
                            alt={projectForm.title || "Capa do projeto"}
                          />
                        ) : (
                          <div className="grid h-[240px] place-items-center text-muted">
                            <div className="grid justify-items-center gap-3 text-center">
                              <ImageIcon size={28} />
                              <span className="text-sm">Nenhuma capa definida ainda</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge>{projectForm.category || "Categoria"}</Badge>
                          <Badge tone={projectForm.featured ? "accent" : "default"}>
                            {projectForm.featured ? "Destaque na home" : "Nao destacado"}
                          </Badge>
                        </div>
                        <h2 className="text-[1.8rem] leading-[1.02] font-light tracking-[-0.03em] text-ink">
                          {projectForm.title || "Titulo do projeto"}
                        </h2>
                        <div className="flex flex-wrap gap-3 text-sm text-muted">
                          {projectForm.location ? (
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin size={14} />
                              {projectForm.location}
                            </span>
                          ) : null}
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays size={14} />
                            {projectForm.year}
                          </span>
                        </div>
                        <p className="text-[0.98rem] leading-7 text-muted">
                          {projectForm.summary || "O resumo do projeto aparece aqui para revisar a leitura da home e das listagens."}
                        </p>
                      </div>
                    </div>
                  </SurfaceCard>

                  <SurfaceCard title="Galeria pronta" subtitle="Imagens que vao compor a pagina individual.">
                    {projectImages.length ? (
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {projectImages.slice(0, 6).map((image, index) => (
                          <div
                            className="overflow-hidden rounded-2xl border border-line bg-soft"
                            key={`${image}-${index}`}
                          >
                            <img
                              className="h-[148px] w-full object-cover"
                              src={image}
                              alt={`Imagem ${index + 1} do projeto`}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={Upload}
                        title="Sem imagens carregadas"
                        description="Use o upload para enviar uma ou varias fotos. Elas entram aqui e depois na pagina do projeto."
                      />
                    )}
                  </SurfaceCard>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
                  <SurfaceCard title={selectedProjectTitle} subtitle="Campos principais do cadastro.">
                    <form className="grid gap-6" onSubmit={saveProject}>
                      <FormSection title="Identificacao">
                        <div className="grid gap-4 md:grid-cols-2">
                          <Field label="Titulo" value={projectForm.title} onChange={(title) => setProjectForm({ ...projectForm, title })} />
                          <Field label="Slug" value={projectForm.slug} onChange={(slug) => setProjectForm({ ...projectForm, slug })} />
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                          <Field label="Categoria" value={projectForm.category} onChange={(category) => setProjectForm({ ...projectForm, category })} />
                          <Field label="Local" value={projectForm.location} onChange={(location) => setProjectForm({ ...projectForm, location })} />
                          <Field label="Ano" value={projectForm.year} onChange={(year) => setProjectForm({ ...projectForm, year })} />
                        </div>
                      </FormSection>

                      <FormSection title="Conteudo">
                        <TextArea label="Resumo" value={projectForm.summary} onChange={(summary) => setProjectForm({ ...projectForm, summary })} />
                        <TextArea label="Descricao" value={projectForm.description} onChange={(description) => setProjectForm({ ...projectForm, description })} />
                      </FormSection>

                      <FormSection title="Midia">
                        <Field
                          required={false}
                          label="Imagem principal (URL manual)"
                          value={projectForm.coverUrl}
                          onChange={(coverUrl) => setProjectForm({ ...projectForm, coverUrl })}
                        />

                        <div className="grid gap-3 rounded-2xl border border-dashed border-line bg-soft p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper text-ink">
                              <Upload size={18} />
                            </div>
                            <div className="grid gap-1">
                              <p className="text-sm font-semibold text-ink">Upload de imagens</p>
                              <p className="text-sm leading-6 text-muted">
                                Envie uma ou varias fotos. A primeira enviada vira a capa se o campo principal estiver vazio.
                              </p>
                            </div>
                          </div>
                          <input
                            className={inputClass}
                            id="upload"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={uploadImage}
                          />
                        </div>

                        <TextArea
                          required={false}
                          label="Galeria, uma URL por linha"
                          value={projectForm.imagesText}
                          onChange={(imagesText) => setProjectForm({ ...projectForm, imagesText })}
                        />
                      </FormSection>

                      <label className="flex items-center gap-3 rounded-2xl border border-line bg-soft px-4 py-3 text-sm font-semibold text-ink">
                        <input
                          className="h-4 w-4 rounded border-line text-ink focus:ring-black/10"
                          type="checkbox"
                          checked={projectForm.featured}
                          onChange={(event) => setProjectForm({ ...projectForm, featured: event.target.checked })}
                        />
                        Exibir como destaque na home
                      </label>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <button className={buttonPrimaryClass} type="submit" disabled={loading}>
                          <Save size={17} />
                          {loading ? "salvando..." : "salvar projeto"}
                        </button>
                        <button className={buttonGhostClass} type="button" onClick={() => setProjectForm(emptyProject)}>
                          <Plus size={17} />
                          limpar formulario
                        </button>
                      </div>
                    </form>
                  </SurfaceCard>

                  <SurfaceCard title="Projetos publicados" subtitle="Biblioteca pronta para revisar e editar.">
                    <div className="grid gap-3">
                      {projects.length === 0 ? (
                        <EmptyState
                          icon={FolderOpen}
                          title="Sem projetos cadastrados"
                          description="Quando voce salvar um projeto, ele passa a aparecer nesta lista."
                        />
                      ) : (
                        projects.map((project) => (
                          <ProjectLibraryCard
                            key={project.id}
                            project={project}
                            onEdit={() => editProject(project)}
                            onDelete={() => removeProject(project.id)}
                          />
                        ))
                      )}
                    </div>
                  </SurfaceCard>
                </div>
              </div>
            ) : null}

            {tab === "feedbacks" ? (
              <div className="grid gap-6">
                <div className="grid gap-3 md:grid-cols-3">
                  <OverviewMetric
                    icon={MessageSquare}
                    label="Feedbacks"
                    value={feedbacks.length}
                    note="itens cadastrados"
                  />
                  <OverviewMetric
                    icon={CheckCircle2}
                    label="Publicados"
                    value={approvedFeedbacks}
                    note="visiveis no site"
                  />
                  <OverviewMetric
                    icon={Clock3}
                    label="Rascunhos"
                    value={feedbacks.length - approvedFeedbacks}
                    note="ainda fora do site"
                  />
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,0.98fr)_minmax(360px,1.02fr)]">
                  <SurfaceCard
                    title={feedbackForm.id ? "Editar feedback" : "Novo feedback"}
                    subtitle="Depoimentos com contexto e controle de exibicao."
                  >
                    <form className="grid gap-6" onSubmit={saveFeedback}>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Cliente" value={feedbackForm.clientName} onChange={(clientName) => setFeedbackForm({ ...feedbackForm, clientName })} />
                        <Field label="Contexto" value={feedbackForm.role} onChange={(role) => setFeedbackForm({ ...feedbackForm, role })} />
                      </div>
                      <Field required={false} label="Slug do projeto" value={feedbackForm.projectSlug} onChange={(projectSlug) => setFeedbackForm({ ...feedbackForm, projectSlug })} />
                      <TextArea label="Depoimento" value={feedbackForm.quote} onChange={(quote) => setFeedbackForm({ ...feedbackForm, quote })} />
                      <label className="flex items-center gap-3 rounded-2xl border border-line bg-soft px-4 py-3 text-sm font-semibold text-ink">
                        <input
                          className="h-4 w-4 rounded border-line text-ink focus:ring-black/10"
                          type="checkbox"
                          checked={feedbackForm.approved}
                          onChange={(event) => setFeedbackForm({ ...feedbackForm, approved: event.target.checked })}
                        />
                        Exibir no site
                      </label>
                      <button className={buttonPrimaryClass} type="submit" disabled={loading}>
                        <Save size={17} />
                        salvar feedback
                      </button>
                    </form>
                  </SurfaceCard>

                  <SurfaceCard title="Biblioteca de feedbacks" subtitle="Edite, revise e remova depoimentos.">
                    <div className="grid gap-3">
                      {feedbacks.length === 0 ? (
                        <EmptyState
                          icon={MessageSquare}
                          title="Sem feedbacks cadastrados"
                          description="Adicione os primeiros depoimentos para reforcar a credibilidade do portfolio."
                        />
                      ) : (
                        feedbacks.map((feedback) => (
                          <FeedbackLibraryCard
                            key={feedback.id}
                            feedback={feedback}
                            onEdit={() => editFeedback(feedback)}
                            onDelete={() => removeFeedback(feedback.id)}
                          />
                        ))
                      )}
                    </div>
                  </SurfaceCard>
                </div>
              </div>
            ) : null}

            {tab === "contacts" ? (
              <div className="grid gap-6">
                <div className="grid gap-3 md:grid-cols-3">
                  <OverviewMetric
                    icon={Inbox}
                    label="Mensagens"
                    value={contacts.length}
                    note="contatos recebidos"
                  />
                  <OverviewMetric
                    icon={Mail}
                    label="Com e-mail"
                    value={contacts.filter((contact) => Boolean(contact.email)).length}
                    note="prontos para retorno"
                  />
                  <OverviewMetric
                    icon={Clock3}
                    label="Triagem"
                    value={contacts.length}
                    note="lista atual do inbox"
                  />
                </div>

                <SurfaceCard title="Inbox do site" subtitle="Mensagens recebidas pelo formulario de contato.">
                  <div className="grid gap-3">
                    {contacts.length === 0 ? (
                      <EmptyState
                        icon={Inbox}
                        title="Sem mensagens salvas"
                        description="Quando alguem entrar em contato pelo site, a mensagem aparece aqui."
                      />
                    ) : (
                      contacts.map((contact) => (
                        <ContactCard key={contact.id} contact={contact} />
                      ))
                    )}
                  </div>
                </SurfaceCard>
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  )
}

function SidebarButton({
  active,
  icon: Icon,
  label,
  onClick
}: {
  active: boolean
  icon: LucideIcon
  label: string
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        "inline-flex min-h-12 items-center gap-3 rounded-2xl px-4 text-left text-sm font-medium transition",
        active ? "bg-white text-ink shadow-[0_10px_30px_rgba(255,255,255,0.08)]" : "text-white/70 hover:bg-white/7 hover:text-white"
      )}
      type="button"
      onClick={onClick}
    >
      <Icon size={17} />
      {label}
    </button>
  )
}

function MobileTabButton({
  active,
  icon: Icon,
  label,
  onClick
}: {
  active: boolean
  icon: LucideIcon
  label: string
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-2xl px-4 text-sm font-medium whitespace-nowrap transition",
        active ? "bg-ink text-white" : "text-muted hover:bg-paper hover:text-ink"
      )}
      type="button"
      onClick={onClick}
    >
      <Icon size={16} />
      {label}
    </button>
  )
}

function LoginFeature({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/78">
      <Icon size={16} />
      <span>{text}</span>
    </div>
  )
}

function SurfaceCard({
  title,
  subtitle,
  actionLabel,
  onAction,
  children
}: {
  title: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
  children: React.ReactNode
}) {
  return (
    <section className="rounded-[26px] border border-line bg-white p-5 shadow-[0_20px_50px_rgba(32,33,29,0.06)] md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <h2 className="text-[1.2rem] font-semibold text-ink">{title}</h2>
          {subtitle ? <p className="text-sm leading-6 text-muted">{subtitle}</p> : null}
        </div>
        {actionLabel && onAction ? (
          <button
            className="inline-flex items-center gap-2 text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-muted transition hover:text-ink"
            type="button"
            onClick={onAction}
          >
            {actionLabel}
            <ArrowUpRight size={14} />
          </button>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function OverviewMetric({
  icon: Icon,
  label,
  value,
  note
}: {
  icon: LucideIcon
  label: string
  value: number
  note: string
}) {
  return (
    <div className="rounded-[24px] border border-line bg-white p-5 shadow-[0_20px_50px_rgba(32,33,29,0.05)]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-muted">
            {label}
          </span>
          <strong className="text-[2rem] leading-none font-light text-ink">{value}</strong>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-soft text-ink">
          <Icon size={18} />
        </div>
      </div>
      <p className="text-sm leading-6 text-muted">{note}</p>
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  description
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <div className="grid min-h-[220px] place-items-center rounded-[24px] border border-dashed border-line bg-soft/70 px-6 py-10 text-center">
      <div className="grid max-w-[22rem] justify-items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-paper text-ink">
          <Icon size={18} />
        </div>
        <strong className="text-[1.05rem] text-ink">{title}</strong>
        <p className="text-sm leading-6 text-muted">{description}</p>
      </div>
    </div>
  )
}

function Badge({
  children,
  tone = "default"
}: {
  children: React.ReactNode
  tone?: "default" | "accent" | "success"
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[0.72rem] font-extrabold uppercase tracking-[0.12em]",
        tone === "accent" && "bg-ink text-white",
        tone === "success" && "bg-[#eef2e5] text-[#4b5a34]",
        tone === "default" && "bg-soft text-muted"
      )}
    >
      {children}
    </span>
  )
}

function ProjectRow({ project, onEdit }: { project: Project; onEdit: () => void }) {
  return (
    <button
      className="grid w-full grid-cols-[64px_minmax(0,1fr)] gap-4 rounded-2xl border border-line bg-soft/55 p-3 text-left transition hover:border-ink/20 hover:bg-soft"
      type="button"
      onClick={onEdit}
    >
      <div className="overflow-hidden rounded-xl bg-paper">
        {project.coverUrl ? (
          <img className="h-16 w-16 object-cover" src={project.coverUrl} alt={project.title} />
        ) : (
          <div className="grid h-16 w-16 place-items-center text-muted">
            <ImageIcon size={16} />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <strong className="truncate text-ink">{project.title}</strong>
          {project.featured ? <Badge tone="accent">Destaque</Badge> : null}
        </div>
        <p className="text-sm text-muted">{project.category}</p>
        <p className="truncate text-sm text-muted">{project.location}</p>
      </div>
    </button>
  )
}

function QuoteCard({
  feedback,
  onEdit
}: {
  feedback: Feedback
  onEdit: () => void
}) {
  return (
    <button
      className="grid gap-3 rounded-2xl border border-line bg-soft/55 p-4 text-left transition hover:border-ink/20 hover:bg-soft"
      type="button"
      onClick={onEdit}
    >
      <div className="flex items-center justify-between gap-3">
        <strong>{feedback.clientName}</strong>
        <Badge tone={feedback.approved ? "success" : "default"}>
          {feedback.approved ? "Publicado" : "Rascunho"}
        </Badge>
      </div>
      <p className="text-sm text-muted">{feedback.role}</p>
      <p className="line-clamp-3 text-[0.98rem] leading-7 text-ink">"{feedback.quote}"</p>
    </button>
  )
}

function HeroProjectCard({ project }: { project: Project }) {
  return (
    <div className="grid gap-4">
      <div className="overflow-hidden rounded-[24px] border border-line bg-soft">
        {project.coverUrl ? (
          <img className="h-[260px] w-full object-cover" src={project.coverUrl} alt={project.title} />
        ) : (
          <div className="grid h-[260px] place-items-center text-muted">
            <ImageIcon size={24} />
          </div>
        )}
      </div>
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">Home</Badge>
          <Badge>{project.category}</Badge>
        </div>
        <h3 className="text-[1.8rem] leading-[1.02] font-light tracking-[-0.03em] text-ink">
          {project.title}
        </h3>
        <p className="text-[0.98rem] leading-7 text-muted">{project.summary}</p>
      </div>
    </div>
  )
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-4">
      <div className="border-b border-line pb-3">
        <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-muted">{title}</p>
      </div>
      <div className="grid gap-4">{children}</div>
    </div>
  )
}

function ProjectLibraryCard({
  project,
  onEdit,
  onDelete
}: {
  project: Project
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <article className="rounded-[24px] border border-line bg-soft/55 p-4">
      <div className="mb-4 grid grid-cols-[84px_minmax(0,1fr)] gap-4">
        <div className="overflow-hidden rounded-2xl bg-paper">
          {project.coverUrl ? (
            <img className="h-[84px] w-[84px] object-cover" src={project.coverUrl} alt={project.title} />
          ) : (
            <div className="grid h-[84px] w-[84px] place-items-center text-muted">
              <ImageIcon size={18} />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <strong className="truncate">{project.title}</strong>
            {project.featured ? <Badge tone="accent">Destaque</Badge> : null}
          </div>
          <p className="text-sm text-muted">{project.category}</p>
          <p className="text-sm text-muted">{project.location}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button className={cn(buttonGhostClass, "flex-1")} onClick={onEdit} type="button">
          Editar
        </button>
        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#9a2f24]/24 bg-white text-[#9a2f24] transition hover:bg-[#9a2f24]/5"
          onClick={onDelete}
          type="button"
          aria-label="Excluir"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </article>
  )
}

function FeedbackLibraryCard({
  feedback,
  onEdit,
  onDelete
}: {
  feedback: Feedback
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <article className="rounded-[24px] border border-line bg-soft/55 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <strong className="mb-1 block">{feedback.clientName}</strong>
          <p className="text-sm text-muted">{feedback.role}</p>
        </div>
        <Badge tone={feedback.approved ? "success" : "default"}>
          {feedback.approved ? "Publicado" : "Rascunho"}
        </Badge>
      </div>
      <p className="mb-4 line-clamp-4 text-[0.98rem] leading-7 text-ink">"{feedback.quote}"</p>
      <div className="flex gap-2">
        <button className={cn(buttonGhostClass, "flex-1")} onClick={onEdit} type="button">
          Editar
        </button>
        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#9a2f24]/24 bg-white text-[#9a2f24] transition hover:bg-[#9a2f24]/5"
          onClick={onDelete}
          type="button"
          aria-label="Excluir"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </article>
  )
}

function ContactCard({ contact }: { contact: ContactMessage }) {
  return (
    <article className="rounded-[24px] border border-line bg-soft/55 p-4 md:p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <strong className="mb-1 block">{contact.name}</strong>
          <p className="text-sm text-muted">{formatContactMeta(contact)}</p>
        </div>
        <Badge>{contact.status}</Badge>
      </div>
      <p className="whitespace-pre-wrap text-[0.98rem] leading-7 text-ink">{contact.message}</p>
    </article>
  )
}

function ListRow({
  title,
  subtitle,
  meta,
  icon: Icon
}: {
  title: string
  subtitle: string
  meta: string
  icon: LucideIcon
}) {
  return (
    <div className="grid grid-cols-[40px_minmax(0,1fr)] gap-4 rounded-2xl border border-line bg-soft/55 p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <strong className="text-sm text-ink">{title}</strong>
          <span className="text-xs uppercase tracking-[0.12em] text-muted">{meta}</span>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-muted">{subtitle}</p>
      </div>
    </div>
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
  const reactId = useId()
  const id = `${label.toLowerCase().replace(/\s+/g, "-")}-${reactId.replace(/:/g, "")}`
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
  const reactId = useId()
  const id = `${label.toLowerCase().replace(/\s+/g, "-")}-${reactId.replace(/:/g, "")}`
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

function formatDate(date?: string) {
  if (!date) return "sem data"

  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short"
    }).format(new Date(date))
  } catch {
    return "sem data"
  }
}

function formatContactMeta(contact: ContactMessage) {
  return [contact.email, contact.phone, formatDate(contact.createdAt)].filter(Boolean).join(" | ")
}
