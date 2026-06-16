import { NextResponse } from "next/server"
import { hasAdminAccess } from "@/lib/auth"
import { deleteProject, upsertProject } from "@/lib/data"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function PUT(request: Request, context: RouteContext) {
  if (!(await hasAdminAccess())) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 })
  }

  try {
    const { id } = await context.params
    return NextResponse.json(await upsertProject(id, await request.json()))
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await hasAdminAccess())) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 })
  }

  try {
    const { id } = await context.params
    await deleteProject(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Erro inesperado."
}
