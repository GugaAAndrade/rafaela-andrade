import { NextResponse } from "next/server"
import { createSessionToken, getAdminPassword, setAdminCookie } from "@/lib/auth"

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: "" }))
  const expectedPassword = getAdminPassword()

  if (!expectedPassword) {
    return NextResponse.json({ error: "Configure ADMIN_PASSWORD no ambiente." }, { status: 500 })
  }

  if (password !== expectedPassword) {
    return NextResponse.json({ error: "Senha invalida." }, { status: 401 })
  }

  await setAdminCookie(createSessionToken())
  return NextResponse.json({ ok: true })
}
