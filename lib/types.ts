export type Project = {
  id: string
  slug: string
  title: string
  category: string
  location: string
  year: string
  area: string
  coverUrl: string
  summary: string
  description: string
  images: string[]
  details: string[]
  featured: boolean
  createdAt?: string
}

export type Feedback = {
  id: string
  clientName: string
  role: string
  quote: string
  projectSlug?: string | null
  approved: boolean
  createdAt?: string
}

export type ContactMessage = {
  id: string
  name: string
  email: string
  phone?: string | null
  message: string
  status: "novo" | "respondido" | "arquivado"
  createdAt?: string
}
