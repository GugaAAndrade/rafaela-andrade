import { v2 as cloudinary } from "cloudinary"

let configured = false

function requireEnv(name: "CLOUDINARY_CLOUD_NAME" | "CLOUDINARY_API_KEY" | "CLOUDINARY_API_SECRET") {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Variavel ${name} ausente.`)
  }

  return value
}

export function getCloudinary() {
  if (!configured) {
    cloudinary.config({
      cloud_name: requireEnv("CLOUDINARY_CLOUD_NAME"),
      api_key: requireEnv("CLOUDINARY_API_KEY"),
      api_secret: requireEnv("CLOUDINARY_API_SECRET"),
      secure: true
    })

    configured = true
  }

  return cloudinary
}

export async function uploadProjectImage(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer())
  const sdk = getCloudinary()

  const result = await new Promise<{
    url: string
    secure_url: string
  }>((resolve, reject) => {
    const stream = sdk.uploader.upload_stream(
      {
        folder: "rafaela-andrade/projects",
        resource_type: "image",
        use_filename: true,
        unique_filename: true
      },
      (error, uploadResult) => {
        if (error) {
          reject(error)
          return
        }

        if (!uploadResult?.secure_url || !uploadResult.url) {
          reject(new Error("Cloudinary nao retornou a URL da imagem."))
          return
        }

        resolve({
          url: uploadResult.url,
          secure_url: uploadResult.secure_url
        })
      }
    )

    stream.end(buffer)
  })

  return {
    url: result.url,
    secureUrl: result.secure_url
  }
}
