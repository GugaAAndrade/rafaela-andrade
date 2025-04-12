'use client'

import Image from "next/image"
import { useEffect } from "react"
import ReactDOM from "react-dom"

export default function ImageModal({ image, onClose }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  if (typeof window === "undefined") return null

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center px-4 cursor-zoom-out overflow-hidden touch-none"
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
