import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Rafaela Arquitetura",
  description: "Portfólio profissional de arquitetura com projetos residenciais, comerciais e interiores.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
