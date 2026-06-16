import { NextResponse } from "next/server"
import { hasAdminAccess } from "@/lib/auth"
import { deleteFeedback, listFeedbacks, upsertFeedback } from "@/lib/data"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const admin = url.searchParams.get("admin") === "1"
  if (admin && !(await hasAdminAccess())) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 })
  }

  try {
    return NextResponse.json(await listFeedbacks(admin))
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!(await hasAdminAccess())) return NextResponse.json({ error: "Nao autorizado." }, { status: 401 })
  try {
    return NextResponse.json(await upsertFeedback(null, await request.json()))
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
  }
}

export async function PATCH(request: Request) {
  if (!(await hasAdminAccess())) return NextResponse.json({ error: "Nao autorizado." }, { status: 401 })
  try {
    const body = await request.json()
    return NextResponse.json(await upsertFeedback(body.id, body))
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  if (!(await hasAdminAccess())) return NextResponse.json({ error: "Nao autorizado." }, { status: 401 })
  try {
    const { id } = await request.json()
    await deleteFeedback(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Erro inesperado."
}
