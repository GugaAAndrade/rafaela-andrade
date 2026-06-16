import { NextResponse } from "next/server"
import { hasAdminAccess } from "@/lib/auth"
import { createContact, listContacts } from "@/lib/data"

export async function GET() {
  if (!(await hasAdminAccess())) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 })
  }

  try {
    return NextResponse.json(await listContacts())
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const message = await createContact(await request.json())
    return NextResponse.json(message)
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Erro inesperado."
}
