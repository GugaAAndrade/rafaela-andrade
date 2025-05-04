import FadeIn from "@/components/animations/fade-in"
import StaggerChildren from "@/components/animations/stagger-children"
import StaggerItem from "@/components/animations/stagger-item"
import ProjectCarousel from "@/components/project-carousel"
import { ChevronRight, Instagram, Mail, MessageCircle } from "lucide-react"
import { Alice } from "next/font/google"
import Image from "next/image"
import Link from "next/link"

const alice = Alice({ subsets: ["latin"], weight: "400" })


export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f0f0f0]/70 backdrop-blur-sm border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-medium text-black">
                <Image
                  src={"/images/marca/marca-no-back.png"}
                  alt={"Logo Rafaela Andrade"}
                  width={100}
                  height={100}
                />
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#sobre" className="text-sm text-black/70 hover:text-black transition-colors">
                Sobre
              </Link>
              <Link href="/projetos" className="text-sm text-black/70 hover:text-black transition-colors">
                Projetos
              </Link>
              <Link href="#servicos" className="text-sm text-black/70 hover:text-black transition-colors">
                Serviços
              </Link>
              <Link href="#contato" className="text-sm text-black/70 hover:text-black transition-colors">
                Contato
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
        <FadeIn direction="right" delay={0.2}>
          <div>
            <h1 className={`text-4xl md:text-6xl font-light mb-1 ${alice.className}`}>
              Rafaela Andrade
            </h1>
            <p className="text-xl text-black font-light mb-8">
              Arquitetura de interiores
            </p>
            <p className="text-black/70 text-lg mb-8 max-w-md">
              Arquiteta especializada em interiores, transformando ambientes em experiências que refletem
              personalidade e estilo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#contato"
                className="px-6 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-colors hover:scale-105 transform duration-300"
              >
                Entre em contato
              </Link>
              <Link
                href="/projetos"
                className="px-6 py-3 border border-black/20 text-black rounded-full hover:bg-black/5 transition-colors hover:scale-105 transform duration-300"
              >
                Ver projetos
              </Link>
            </div>
          </div>
        </FadeIn>

          <FadeIn delay={0.4}>
            <div className="relative h-[400px] w-full rounded-full overflow-hidden border-8 border-[#f0f0f0] transform transition-all duration-700 hover:scale-[1.02] hover:shadow-xl">
              <Image src="/images/rafaela/rafaela-pic.jpeg?height=400&width=400" alt="Rafaela Andrade" fill className="object-cover" />
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="sobre" className="py-20 px-4 md:px-8 bg-[#f0f0f0]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <h2 className="text-3xl font-light mb-8 text-black text-center">Sobre</h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-black/70 text-lg mb-6 text-justify">
                Formada pela Universidade Tiradentes, minha trajetória é marcada por aprendizado contínuo e pela paixão em
                transformar ideias em espaços que promovem bem-estar e qualidade de vida. Estou sempre atenta às novas
                tendências e tecnologias da área, trazendo inovação e eficiência para os meus projetos. Seja para planejar,
                projetar ou reimaginar espaços, meu compromisso é garantir que cada trabalho seja único, significativo e que
                faça a diferença na vida das pessoas.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>


      {/* Featured Projects Section */}
      <section id="projetos" className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <FadeIn>
              <h2 className="text-3xl font-light text-black">Projetos em Destaque</h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Link
                href="/projetos"
                className="flex items-center text-black/70 hover:text-black transition-colors group"
              >
                Ver todos
                <ChevronRight className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </FadeIn>
          </div>

          <FadeIn delay={0.3}>
            <ProjectCarousel />
          </FadeIn>

          <div className="mt-16 text-center">
            <FadeIn delay={0.4}>
              <Link
                href="/projetos"
                className="px-8 py-3 border border-black/20 text-black hover:bg-black/5 transition-colors inline-flex items-center group hover:scale-105 transform duration-300"
              >
                Explorar todos os projetos
                <ChevronRight className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-20 px-4 md:px-8 bg-[#f0f0f0]">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-light mb-12 text-center text-black">Serviços</h2>
          </FadeIn>

          <StaggerChildren>
            <div className="grid md:grid-cols-3 gap-8">
              <StaggerItem>
                <div className="p-6 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-lg">
                  <h3 className="text-xl font-light mb-4 text-black">Projeto Residencial</h3>
                  <p className="text-black/70">
                    Transformação completa ou parcial de residências, criando ambientes que refletem a personalidade e
                    necessidades dos moradores.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="p-6 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-lg">
                  <h3 className="text-xl font-light mb-4 text-black">Projeto Comercial</h3>
                  <p className="text-black/70">
                    Design de espaços comerciais que fortalecem a identidade da marca e proporcionam experiências
                    memoráveis para clientes.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="p-6 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-lg">
                  <h3 className="text-xl font-light mb-4 text-black">Consultoria</h3>
                  <p className="text-black/70">
                    Orientação especializada para decisões pontuais em projetos de interiores, como seleção de cores,
                    materiais, mobiliário e iluminação.
                  </p>
                </div>
              </StaggerItem>
            </div>
          </StaggerChildren>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-light mb-16 text-center text-black">Contato</h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Informações de contato */}
            <FadeIn delay={0.2} direction="right">
              <div className="bg-[#f0f0f0] p-10 rounded-lg">
                <h3 className="text-xl font-light mb-8 border-b border-black/10 pb-4">Informações</h3>

                <div className="space-y-6">
                  <div
                    className="flex items-center gap-4 text-black/80 hover:text-black transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow transition-all">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span>arquitetarafaelaandradd@gmail.com</span>
                  </div>

                  <Link
                    href="https://contate.me/arqrafaelaandrade"
                    className="flex items-center gap-4 text-black/80 hover:text-black transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow transition-all">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span>(79) 99962-1864</span>
                  </Link>

                  <Link
                    href="https://instagram.com/arq.rafaelaandrade"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-black/80 hover:text-black transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow transition-all">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <span>@arq.rafaelaandrade</span>
                  </Link>
                </div>

                <div className="mt-12">
                  <p className="text-black/70 mb-4">Horário de atendimento</p>
                  <p className="text-black">Segunda a Sexta: 9h às 18h</p>
                </div>
              </div>
            </FadeIn>

            {/* Formulário de contato */}
            <FadeIn delay={0.4} direction="left">
            <form
              action="https://formsubmit.co/arquitetarafaelaandradd@gmail.com"
              method="POST"
              className="space-y-6"
            >
              {/* Proteção opcional contra bots */}
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value="https://www.arqrafaelaandrade.com/" />
              
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm text-black/70 block">
                  Nome
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="w-full p-3 bg-[#f0f0f0] border-b-2 border-transparent focus:border-black/50 focus:outline-none transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-sm text-black/70 block">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="w-full p-3 bg-[#f0f0f0] border-b-2 border-transparent focus:border-black/50 focus:outline-none transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="phone" className="text-sm text-black/70 block">
                  Telefone
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  className="w-full p-3 bg-[#f0f0f0] border-b-2 border-transparent focus:border-black/50 focus:outline-none transition-all duration-300"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="text-sm text-black/70 block">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full p-3 bg-[#f0f0f0] border-b-2 border-transparent focus:border-black/50 focus:outline-none transition-all duration-300 resize-none"
                  required
                ></textarea>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 px-6 hover:bg-black/90 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg"
                >
                  Enviar Mensagem
                </button>
              </div>
            </form>

            </FadeIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-black/70 border-t border-black/10">
        <p>© {new Date().getFullYear()} Rafaela Andrade - Arquitetura de Interiores. Todos os direitos reservados.</p>
      </footer>
    </main>
  )
}
