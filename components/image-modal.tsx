// components/image-modal.tsx
'use client'

import Image from "next/image"
import { useEffect } from "react"
import ReactDOM from "react-dom"

export default function ImageModal({ image, onClose }) {
  // ESC e scroll lock
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose()
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleEsc)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleEsc)
    }
  }, [onClose])

  // Evita renderizar em SSR
  if (typeof window === "undefined") return null

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center px-4 cursor-zoom-out"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <Image
          src={image.src}
          alt={image.alt}
          width={1200}
          height={800}
          className="object-contain max-h-[90vh] w-full h-auto rounded-lg shadow-xl"
        />
      </div>
    </div>,
    document.body
  )
}
