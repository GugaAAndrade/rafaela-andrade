"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { buttonPrimaryClass, fieldClass, inputClass, labelClass, textareaClass } from "@/lib/ui"

export function ContactForm() {
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setStatus("")

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = Object.fromEntries(formData.entries())

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      form.reset()
      setStatus("Mensagem enviada. Retornaremos com os próximos passos.")
    } else {
      const data = await response.json().catch(() => null)
      setStatus(data?.error || "Não foi possível enviar agora.")
    }

    setLoading(false)
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className={fieldClass}>
        <label className={labelClass} htmlFor="name">Nome</label>
        <input className={inputClass} id="name" name="name" required />
      </div>
      <div className={fieldClass}>
        <label className={labelClass} htmlFor="email">E-mail</label>
        <input className={inputClass} id="email" type="email" name="email" required />
      </div>
      <div className={fieldClass}>
        <label className={labelClass} htmlFor="phone">Telefone</label>
        <input className={inputClass} id="phone" name="phone" />
      </div>
      <div className={fieldClass}>
        <label className={labelClass} htmlFor="message">Mensagem</label>
        <textarea className={textareaClass} id="message" name="message" required />
      </div>
      <button className={`${buttonPrimaryClass} w-full sm:w-fit`} disabled={loading} type="submit">
        <Send size={17} /> {loading ? "Enviando" : "Enviar contato"}
      </button>
      <p className="min-h-6 text-sm text-ink/70" role="status">
        {status}
      </p>
    </form>
  )
}
