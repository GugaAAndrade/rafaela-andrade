import crypto from "node:crypto"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { NextResponse } from "next/server"
import { hasAdminAccess } from "@/lib/auth"

export async function POST(request: Request) {
  if (!(await hasAdminAccess())) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 })
  }

  if (process.env.VERCEL === "1") {
    return NextResponse.json(
      {
        error:
          "A Vercel nao salva uploads locais. Use imagens em public/ antes do deploy ou cole uma URL externa."
      },
      { status: 400 }
    )
  }

  const formData = await request.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo ausente." }, { status: 400 })
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const safeName = `${Date.now()}-${crypto.randomUUID()}.${extension}`
  const publicDir = path.join(process.cwd(), "public", "uploads")
  const diskPath = path.join(publicDir, safeName)

  await mkdir(publicDir, { recursive: true })
  await writeFile(diskPath, Buffer.from(await file.arrayBuffer()))

  return NextResponse.json({ url: `/uploads/${safeName}` })
}
