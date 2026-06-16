import { NextResponse } from "next/server"
import { hasAdminAccess } from "@/lib/auth"
import { listProjects, upsertProject } from "@/lib/data"

export async function GET() {
  try {
    return NextResponse.json(await listProjects())
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!(await hasAdminAccess())) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 })
  }

  try {
    return NextResponse.json(await upsertProject(null, await request.json()))
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Erro inesperado."
}
