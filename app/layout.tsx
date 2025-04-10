import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from "next";
import { Alice, Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

const alice = Alice({ subsets: ["latin"], weight: "400" })

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Rafaela Andrade | Arquitetura de Interiores",
  description: "Portfólio de Rafaela Andrade, arquiteta especializada em design de interiores.",
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.jpeg',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={inter.className}>
        {children}
        <Analytics />
        <SpeedInsights />
        </body>
    </html>
  )
}


import './globals.css';

