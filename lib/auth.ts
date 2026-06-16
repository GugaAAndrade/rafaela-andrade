import crypto from "node:crypto"
import { cookies } from "next/headers"

const COOKIE_NAME = "rafaela_admin"

function getSecret() {
  return process.env.ADMIN_SECRET || "local-dev-secret-change-me"
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex")
}

export function getAdminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD
  if (process.env.NODE_ENV !== "production") return "admin123"
  return null
}

export function createSessionToken() {
  const payload = `admin:${Date.now()}`
  return `${payload}.${sign(payload)}`
}

export function verifySessionToken(token?: string) {
  if (!token) return false
  const [payload, signature] = token.split(".")
  if (!payload || !signature) return false
  const expected = sign(payload)
  if (signature.length !== expected.length) return false
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

export async function hasAdminAccess() {
  const cookieStore = await cookies()
  return verifySessionToken(cookieStore.get(COOKIE_NAME)?.value)
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
    path: "/"
  })
}

export async function clearAdminCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export { COOKIE_NAME }
