import { Mail, MapPin, Phone } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"
import { SiteHeader } from "@/components/site-header"
import { eyebrowClass, pageMainClass, panelClass, sectionClass, shellClass, textMutedClass } from "@/lib/ui"

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className={pageMainClass}>
        <section className="grid min-h-[30vh] items-end border-b border-line bg-soft py-12 md:min-h-[38vh] md:py-16 xl:py-20">
          <div className={shellClass}>
            <p className={eyebrowClass}>Contato</p>
            <h1 className="max-w-[920px] text-[clamp(2rem,8vw,5.6rem)] leading-[0.98] font-light tracking-[-0.03em]">
              Vamos entender o lugar, a rotina e o que precisa mudar.
            </h1>
          </div>
        </section>
        <section className={sectionClass}>
          <div className={`${shellClass} grid gap-8 lg:grid-cols-[minmax(260px,0.72fr)_minmax(0,1fr)]`}>
            <div className="grid">
              <article className="grid grid-cols-[30px_minmax(0,1fr)] gap-4 border-t border-line py-5">
                <Mail className="text-muted" size={25} />
                <div>
                  <h3 className="mb-2 text-[1.05rem] font-semibold">E-mail</h3>
                  <p className={textMutedClass}>contato@rafaelaarquitetura.com</p>
                </div>
              </article>
              <article className="grid grid-cols-[30px_minmax(0,1fr)] gap-4 border-t border-line py-5">
                <Phone className="text-muted" size={25} />
                <div>
                  <h3 className="mb-2 text-[1.05rem] font-semibold">WhatsApp</h3>
                  <p className={textMutedClass}>(82) 99999-0000</p>
                </div>
              </article>
              <article className="grid grid-cols-[30px_minmax(0,1fr)] gap-4 border-t border-line py-5">
                <MapPin className="text-muted" size={25} />
                <div>
                  <h3 className="mb-2 text-[1.05rem] font-semibold">Atendimento</h3>
                  <p className={textMutedClass}>Maceió e projetos selecionados em outras cidades.</p>
                </div>
              </article>
            </div>
            <div className={panelClass}>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
