import crypto from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { z } from "zod"
import { seedFeedbacks, seedProjects } from "@/lib/seed"
import type { ContactMessage, Feedback, Project } from "@/lib/types"

type SiteData = {
  projects: Project[]
  feedbacks: Feedback[]
  contacts: ContactMessage[]
}

const dataFile = path.join(process.cwd(), "data", "site-data.json")

const imageUrlSchema = z.string().min(1).refine(
  (value) => {
    if (value.startsWith("/")) return true
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  },
  { message: "Use uma URL completa ou um caminho local iniciado por /." }
)

const projectSchema = z.object({
  slug: z.string().min(2).max(90).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2),
  category: z.string().min(2),
  location: z.string().min(2),
  year: z.string().min(4),
  area: z.string().default(""),
  coverUrl: imageUrlSchema,
  summary: z.string().min(12),
  description: z.string().min(20),
  images: z.array(imageUrlSchema).default([]),
  details: z.array(z.string()).default([]),
  featured: z.boolean().default(false)
})

const feedbackSchema = z.object({
  clientName: z.string().min(2),
  role: z.string().min(2),
  quote: z.string().min(12),
  projectSlug: z.string().optional().nullable(),
  approved: z.boolean().default(true)
})

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  message: z.string().min(10)
})

function defaultData(): SiteData {
  return {
    projects: seedProjects,
    feedbacks: seedFeedbacks,
    contacts: []
  }
}

async function readData(): Promise<SiteData> {
  try {
    const content = await readFile(dataFile, "utf8")
    const parsed = JSON.parse(content) as Partial<SiteData>
    return {
      projects: parsed.projects?.length ? parsed.projects : seedProjects,
      feedbacks: parsed.feedbacks?.length ? parsed.feedbacks : seedFeedbacks,
      contacts: parsed.contacts || []
    }
  } catch {
    return defaultData()
  }
}

async function writeData(data: SiteData) {
  if (process.env.VERCEL === "1") {
    throw new Error("Sem banco externo, a Vercel nao salva alteracoes do admin. Edite localmente e faca deploy.")
  }

  await mkdir(path.dirname(dataFile), { recursive: true })
  await writeFile(dataFile, `${JSON.stringify(data, null, 2)}\n`, "utf8")
}

export function parseProject(input: unknown) {
  return projectSchema.parse(input)
}

export function parseFeedback(input: unknown) {
  return feedbackSchema.parse(input)
}

export function parseContact(input: unknown) {
  return contactSchema.parse(input)
}

export async function listProjects(): Promise<Project[]> {
  const data = await readData()
  return [...data.projects].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const data = await readData()
  return data.projects.find((project) => project.slug === slug) || null
}

export async function upsertProject(id: string | null, input: unknown): Promise<Project> {
  const data = await readData()
  const parsed = parseProject(input)
  const now = new Date().toISOString()
  const project: Project = {
    id: id || crypto.randomUUID(),
    ...parsed,
    createdAt: data.projects.find((item) => item.id === id)?.createdAt || now
  }

  const index = data.projects.findIndex((item) => item.id === id)
  if (index >= 0) {
    data.projects[index] = project
  } else {
    data.projects.unshift(project)
  }

  await writeData(data)
  return project
}

export async function deleteProject(id: string): Promise<void> {
  const data = await readData()
  data.projects = data.projects.filter((project) => project.id !== id)
  await writeData(data)
}

export async function listFeedbacks(includePending = false): Promise<Feedback[]> {
  const data = await readData()
  return data.feedbacks.filter((feedback) => includePending || feedback.approved)
}

export async function upsertFeedback(id: string | null, input: unknown): Promise<Feedback> {
  const data = await readData()
  const parsed = parseFeedback(input)
  const now = new Date().toISOString()
  const feedback: Feedback = {
    id: id || crypto.randomUUID(),
    ...parsed,
    projectSlug: parsed.projectSlug || null,
    createdAt: data.feedbacks.find((item) => item.id === id)?.createdAt || now
  }

  const index = data.feedbacks.findIndex((item) => item.id === id)
  if (index >= 0) {
    data.feedbacks[index] = feedback
  } else {
    data.feedbacks.unshift(feedback)
  }

  await writeData(data)
  return feedback
}

export async function deleteFeedback(id: string): Promise<void> {
  const data = await readData()
  data.feedbacks = data.feedbacks.filter((feedback) => feedback.id !== id)
  await writeData(data)
}

export async function createContact(input: unknown): Promise<ContactMessage> {
  const data = await readData()
  const parsed = parseContact(input)
  const contact: ContactMessage = {
    id: crypto.randomUUID(),
    name: parsed.name,
    email: parsed.email,
    phone: parsed.phone,
    message: parsed.message,
    status: "novo",
    createdAt: new Date().toISOString()
  }

  data.contacts.unshift(contact)
  await writeData(data)
  return contact
}

export async function listContacts(): Promise<ContactMessage[]> {
  const data = await readData()
  return data.contacts
}
