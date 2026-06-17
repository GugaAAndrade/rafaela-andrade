import { NextResponse } from "next/server"
import { hasAdminAccess } from "@/lib/auth"
import { uploadProjectImage } from "@/lib/cloudinary"

export async function POST(request: Request) {
  if (!(await hasAdminAccess())) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo ausente." }, { status: 400 })
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Envie apenas arquivos de imagem." }, { status: 400 })
  }

  try {
    const upload = await uploadProjectImage(file)

    return NextResponse.json({
      url: upload.url,
      secureUrl: upload.secureUrl
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel enviar a imagem."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
