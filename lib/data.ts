import crypto from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { neon } from "@neondatabase/serverless"
import { z } from "zod"
import { seedFeedbacks, seedProjects } from "@/lib/seed"
import type { ContactMessage, Feedback, Project } from "@/lib/types"

type SiteData = {
  projects: Project[]
  feedbacks: Feedback[]
  contacts: ContactMessage[]
}

type DbRow = Record<string, unknown>

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

let initPromise: Promise<void> | null = null

function defaultData(): SiteData {
  return {
    projects: seedProjects,
    feedbacks: seedFeedbacks,
    contacts: []
  }
}

function hasDatabase() {
  return Boolean(process.env.DATABASE_URL)
}

function getDb() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error("DATABASE_URL ausente.")
  }

  return neon(databaseUrl)
}

async function readLocalData(): Promise<SiteData> {
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

async function writeLocalData(data: SiteData) {
  await mkdir(path.dirname(dataFile), { recursive: true })
  await writeFile(dataFile, `${JSON.stringify(data, null, 2)}\n`, "utf8")
}

async function ensureDatabase() {
  if (!hasDatabase()) return

  if (!initPromise) {
    initPromise = (async () => {
      const sql = getDb()

      await sql`
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          title TEXT NOT NULL,
          category TEXT NOT NULL,
          location TEXT NOT NULL,
          year TEXT NOT NULL,
          area TEXT NOT NULL DEFAULT '',
          cover_url TEXT NOT NULL,
          summary TEXT NOT NULL,
          description TEXT NOT NULL,
          images JSONB NOT NULL DEFAULT '[]'::jsonb,
          details JSONB NOT NULL DEFAULT '[]'::jsonb,
          featured BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `

      await sql`
        CREATE TABLE IF NOT EXISTS feedbacks (
          id TEXT PRIMARY KEY,
          client_name TEXT NOT NULL,
          role TEXT NOT NULL,
          quote TEXT NOT NULL,
          project_slug TEXT,
          approved BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `

      await sql`
        CREATE TABLE IF NOT EXISTS contacts (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          message TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'novo',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `

      const [projectCountRow] = await sql`SELECT COUNT(*)::int AS count FROM projects`
      const [feedbackCountRow] = await sql`SELECT COUNT(*)::int AS count FROM feedbacks`
      const [contactCountRow] = await sql`SELECT COUNT(*)::int AS count FROM contacts`

      const projectCount = Number(projectCountRow?.count || 0)
      const feedbackCount = Number(feedbackCountRow?.count || 0)
      const contactCount = Number(contactCountRow?.count || 0)

      if (projectCount || feedbackCount || contactCount) return

      const localData = await readLocalData()

      for (const project of localData.projects) {
        await sql`
          INSERT INTO projects (
            id,
            slug,
            title,
            category,
            location,
            year,
            area,
            cover_url,
            summary,
            description,
            images,
            details,
            featured,
            created_at
          ) VALUES (
            ${project.id},
            ${project.slug},
            ${project.title},
            ${project.category},
            ${project.location},
            ${project.year},
            ${project.area || ""},
            ${project.coverUrl},
            ${project.summary},
            ${project.description},
            ${JSON.stringify(project.images || [])}::jsonb,
            ${JSON.stringify(project.details || [])}::jsonb,
            ${project.featured},
            ${project.createdAt || new Date().toISOString()}
          )
          ON CONFLICT (id) DO NOTHING
        `
      }

      for (const feedback of localData.feedbacks) {
        await sql`
          INSERT INTO feedbacks (
            id,
            client_name,
            role,
            quote,
            project_slug,
            approved,
            created_at
          ) VALUES (
            ${feedback.id},
            ${feedback.clientName},
            ${feedback.role},
            ${feedback.quote},
            ${feedback.projectSlug || null},
            ${feedback.approved},
            ${feedback.createdAt || new Date().toISOString()}
          )
          ON CONFLICT (id) DO NOTHING
        `
      }

      for (const contact of localData.contacts) {
        await sql`
          INSERT INTO contacts (
            id,
            name,
            email,
            phone,
            message,
            status,
            created_at
          ) VALUES (
            ${contact.id},
            ${contact.name},
            ${contact.email},
            ${contact.phone || null},
            ${contact.message},
            ${contact.status},
            ${contact.createdAt || new Date().toISOString()}
          )
          ON CONFLICT (id) DO NOTHING
        `
      }
    })()
  }

  await initPromise
}

function toIsoString(value: unknown) {
  if (!value) return undefined
  if (value instanceof Date) return value.toISOString()
  return new Date(String(value)).toISOString()
}

function asStringArray(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => String(item))
  return []
}

function mapProjectRow(row: DbRow): Project {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    category: String(row.category),
    location: String(row.location),
    year: String(row.year),
    area: String(row.area || ""),
    coverUrl: String(row.cover_url),
    summary: String(row.summary),
    description: String(row.description),
    images: asStringArray(row.images),
    details: asStringArray(row.details),
    featured: Boolean(row.featured),
    createdAt: toIsoString(row.created_at)
  }
}

function mapFeedbackRow(row: DbRow): Feedback {
  return {
    id: String(row.id),
    clientName: String(row.client_name),
    role: String(row.role),
    quote: String(row.quote),
    projectSlug: row.project_slug ? String(row.project_slug) : null,
    approved: Boolean(row.approved),
    createdAt: toIsoString(row.created_at)
  }
}

function mapContactRow(row: DbRow): ContactMessage {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: row.phone ? String(row.phone) : null,
    message: String(row.message),
    status: String(row.status) as ContactMessage["status"],
    createdAt: toIsoString(row.created_at)
  }
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
  if (!hasDatabase()) {
    const data = await readLocalData()
    return [...data.projects].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
  }

  await ensureDatabase()
  const sql = getDb()
  const rows = await sql`SELECT * FROM projects ORDER BY created_at DESC`
  return rows.map((row) => mapProjectRow(row as DbRow))
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!hasDatabase()) {
    const data = await readLocalData()
    return data.projects.find((project) => project.slug === slug) || null
  }

  await ensureDatabase()
  const sql = getDb()
  const rows = await sql`SELECT * FROM projects WHERE slug = ${slug} LIMIT 1`
  return rows[0] ? mapProjectRow(rows[0] as DbRow) : null
}

export async function upsertProject(id: string | null, input: unknown): Promise<Project> {
  const parsed = parseProject(input)

  if (!hasDatabase()) {
    const data = await readLocalData()
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

    await writeLocalData(data)
    return project
  }

  await ensureDatabase()
  const sql = getDb()
  const projectId = id || crypto.randomUUID()
  const existing = id ? await sql`SELECT created_at FROM projects WHERE id = ${id} LIMIT 1` : []
  const createdAt = existing[0]?.created_at ? toIsoString(existing[0].created_at)! : new Date().toISOString()

  const rows = await sql`
    INSERT INTO projects (
      id,
      slug,
      title,
      category,
      location,
      year,
      area,
      cover_url,
      summary,
      description,
      images,
      details,
      featured,
      created_at
    ) VALUES (
      ${projectId},
      ${parsed.slug},
      ${parsed.title},
      ${parsed.category},
      ${parsed.location},
      ${parsed.year},
      ${parsed.area || ""},
      ${parsed.coverUrl},
      ${parsed.summary},
      ${parsed.description},
      ${JSON.stringify(parsed.images)}::jsonb,
      ${JSON.stringify(parsed.details)}::jsonb,
      ${parsed.featured},
      ${createdAt}
    )
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug,
      title = EXCLUDED.title,
      category = EXCLUDED.category,
      location = EXCLUDED.location,
      year = EXCLUDED.year,
      area = EXCLUDED.area,
      cover_url = EXCLUDED.cover_url,
      summary = EXCLUDED.summary,
      description = EXCLUDED.description,
      images = EXCLUDED.images,
      details = EXCLUDED.details,
      featured = EXCLUDED.featured
    RETURNING *
  `

  return mapProjectRow(rows[0] as DbRow)
}

export async function deleteProject(id: string): Promise<void> {
  if (!hasDatabase()) {
    const data = await readLocalData()
    data.projects = data.projects.filter((project) => project.id !== id)
    await writeLocalData(data)
    return
  }

  await ensureDatabase()
  const sql = getDb()
  await sql`DELETE FROM projects WHERE id = ${id}`
}

export async function listFeedbacks(includePending = false): Promise<Feedback[]> {
  if (!hasDatabase()) {
    const data = await readLocalData()
    return data.feedbacks.filter((feedback) => includePending || feedback.approved)
  }

  await ensureDatabase()
  const sql = getDb()
  const rows = includePending
    ? await sql`SELECT * FROM feedbacks ORDER BY created_at DESC`
    : await sql`SELECT * FROM feedbacks WHERE approved = TRUE ORDER BY created_at DESC`
  return rows.map((row) => mapFeedbackRow(row as DbRow))
}

export async function upsertFeedback(id: string | null, input: unknown): Promise<Feedback> {
  const parsed = parseFeedback(input)

  if (!hasDatabase()) {
    const data = await readLocalData()
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

    await writeLocalData(data)
    return feedback
  }

  await ensureDatabase()
  const sql = getDb()
  const feedbackId = id || crypto.randomUUID()
  const existing = id ? await sql`SELECT created_at FROM feedbacks WHERE id = ${id} LIMIT 1` : []
  const createdAt = existing[0]?.created_at ? toIsoString(existing[0].created_at)! : new Date().toISOString()

  const rows = await sql`
    INSERT INTO feedbacks (
      id,
      client_name,
      role,
      quote,
      project_slug,
      approved,
      created_at
    ) VALUES (
      ${feedbackId},
      ${parsed.clientName},
      ${parsed.role},
      ${parsed.quote},
      ${parsed.projectSlug || null},
      ${parsed.approved},
      ${createdAt}
    )
    ON CONFLICT (id) DO UPDATE SET
      client_name = EXCLUDED.client_name,
      role = EXCLUDED.role,
      quote = EXCLUDED.quote,
      project_slug = EXCLUDED.project_slug,
      approved = EXCLUDED.approved
    RETURNING *
  `

  return mapFeedbackRow(rows[0] as DbRow)
}

export async function deleteFeedback(id: string): Promise<void> {
  if (!hasDatabase()) {
    const data = await readLocalData()
    data.feedbacks = data.feedbacks.filter((feedback) => feedback.id !== id)
    await writeLocalData(data)
    return
  }

  await ensureDatabase()
  const sql = getDb()
  await sql`DELETE FROM feedbacks WHERE id = ${id}`
}

export async function createContact(input: unknown): Promise<ContactMessage> {
  const parsed = parseContact(input)

  if (!hasDatabase()) {
    const data = await readLocalData()
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
    await writeLocalData(data)
    return contact
  }

  await ensureDatabase()
  const sql = getDb()
  const contactId = crypto.randomUUID()
  const createdAt = new Date().toISOString()

  const rows = await sql`
    INSERT INTO contacts (
      id,
      name,
      email,
      phone,
      message,
      status,
      created_at
    ) VALUES (
      ${contactId},
      ${parsed.name},
      ${parsed.email},
      ${parsed.phone || null},
      ${parsed.message},
      ${"novo"},
      ${createdAt}
    )
    RETURNING *
  `

  return mapContactRow(rows[0] as DbRow)
}

export async function listContacts(): Promise<ContactMessage[]> {
  if (!hasDatabase()) {
    const data = await readLocalData()
    return data.contacts
  }

  await ensureDatabase()
  const sql = getDb()
  const rows = await sql`SELECT * FROM contacts ORDER BY created_at DESC`
  return rows.map((row) => mapContactRow(row as DbRow))
}
