'use client'

import FadeIn from "@/components/animations/fade-in"
import ImageModal from "@/components/image-modal"
import { ChevronLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"


// Dados dos projetos
const projectCategories = [
  {
    id: "residencial",
    title: "Projetos Residenciais",
    projects: [
      {
        id: "res-1",
        title: "Projeto Ares",
        description:
          "O projeto Ares nasce da intenção de criar um espaço onde o tempo desacelera e o ar elemento invisível, mas essencial se torna protagonista. Inspirado pela leveza, fluidez e transparência, o ambiente convida à contemplação, ao respiro e ao encontro com o agora. A sala apresenta uma linguagem contemporânea limpa, com linhas retas, volumes bem definidos e uma paleta neutra pontuada por texturas naturais. Cada escolha de material, mobiliário e iluminação foi pensada para ampliar a sensação de espaço e liberdade, promovendo bem-estar e equilíbrio visual.",
        layout: "layout-4",
        images: [
          {
            src: "/images/projeto-ares/ares-1.jpeg",
            alt: "Quarto minimalista com tons neutros",
          },
          {
            src: "/images/projeto-ares/ares-2.jpeg?height=500&width=900",
            alt: "Sala de estar com design clean",
          },
          {
            src: "/images/projeto-ares/ares-3.jpeg?height=500&width=900",
            alt: "Cozinha integrada com ilha central",
          },

        ],
      },
      {
        id: "res-2",
        title: "Projeto Quarto Clariê",
        description:
          "Clariê é a tradução de um refúgio onde suavidade e modernidade se encontram em perfeita harmonia. Um espaço que convida à pausa, ao respiro e ao cuidado, envolvido por uma atmosfera serena e luminosa. A paleta de tons claros guia a composição e amplia o ambiente com delicadeza, reforçando a sensação de calma e frescor. Texturas sutis, acabamentos suaves e volumes bem definidos criam uma narrativa visual limpa, mas repleta de conforto e intenção. Cada elemento foi pensado para proporcionar uma experiência acolhedora da marcenaria de traços precisos à iluminação indireta que embala o espaço com leveza ao longo do dia.",
        layout: "layout-5",
        images: [
          {
            src: "/images/projeto-clarie/clarie-3.jpeg?height=500&width=900",
            alt: "Vista da sala de estar integrada",
          },
          {
            src: "/images/projeto-clarie/clarie-1.jpeg?height=500&width=900",
            alt: "Detalhe da iluminação do apartamento",
          },
        ],
      },
      {
        id: "res-3",
        title: "Projeto Quarto Bruma",
        description:
          "Bruma traduz a leveza dos primeiros sonhos. Em uma paleta de tons suaves, com o rosa claro como protagonista, o quarto convida ao acolhimento e à imaginação. A atmosfera é serena e envolvente, com nuances delicadas que preenchem o espaço com suavidade sem perder a vivacidade da infância. Cada detalhe foi pensado para compor um ambiente calmo, doce e sensível, onde a luz natural toca as superfícies com gentileza e tudo parece acontecer com leveza.",
        layout: "layout-5",
        images: [
          {
            src: "/images/projeto-bruma/bruma-1.jpeg?height=500&width=900",
            alt: "Vista da sala de estar integrada",
          },
          {
            src: "/images/projeto-bruma/bruma-2.jpeg?height=500&width=900",
            alt: "Detalhe da iluminação do apartamento",
          },
          {
            src: "/images/projeto-bruma/bruma-2.jpeg?height=500&width=900",
            alt: "Detalhe da iluminação do apartamento",
          },
        ],
      },
      {
        id: "res-4",
        title: "Projeto Quarto Alma",
        description:
          "Esse projeto nasce como um refúgio sensorial, onde cada escolha estética busca revelar o essencial. A paleta de tons claros expande o espaço com leveza, trazendo uma sensação de respiro e serenidade. O mobiliário moderno, de linhas simples e bem definidas, sustenta a elegância do ambiente sem excessos, permitindo que a sutileza fale mais alto. Neste quarto, forma e função se encontram com equilíbrio, criando uma atmosfera que abraça sem pesar. Mais do que um espaço para descansar, Alma é onde se reconhece a beleza do silêncio, da luz suave e do estar presente.",
        layout: "layout-5",
        images: [
          {
            src: "/images/projeto-alma/alma-2.jpeg?height=500&width=900",
            alt: "Vista da sala de estar integrada",
          },
          {
            src: "/images/projeto-alma/alma-1.jpeg?height=500&width=900",
            alt: "Detalhe da iluminação do apartamento",
          },

        ],
      },
      {
        id: "res-5",
        title: "Projeto Banheiro Auna",
        description:
          "A base do projeto está ancorada no tom quente do MDF Freijó, aplicado ao mobiliário para criar contraste e sofisticação. Em contraponto, o piso e os revestimentos em Gris Armani introduzem uma estética sóbria e contemporânea, com veios delicados e tonalidade acinzentada que reforçam a elegância do espaço. O traço limpo, a precisão das linhas e o equilíbrio entre texturas e volumes resultam em um banheiro moderno, funcional e, acima de tudo, visualmente sofisticado.",
        layout: "layout-5",
        images: [
          {
            src: "/images/projeto-auna/auna-1.jpeg?height=500&width=900",
            alt: "Vista da sala de estar integrada",
          },
          {
            src: "/images/projeto-auna/auna-2.jpeg?height=500&width=900",
            alt: "Detalhe da iluminação do apartamento",
          },

        ],
      },
    ],
  },
  {
    id: "comercial",
    title: "Projetos Comerciais",
    projects: [
      {
        id: "com-1",
        title: "Proposta de Reforma – Restaurante O Miguel",
        description:
          "A proposta de reforma do restaurante O Miguel teve como objetivo atualizar a identidade visual e funcional do espaço, tornando-o mais acolhedor, eficiente e alinhado com a experiência gastronômica que o local já oferece. Buscamos valorizar a essência do restaurante com seu clima familiar e comida afetiva ao mesmo tempo em que trazemos uma atmosfera mais contemporânea e atrativa para o público.",
        layout: "layout-2", // Layout específico para este projeto
        images: [

          {
            src: "/images/projeto-miguel/miguel-2.jpeg?height=500&width=900",
            alt: "Área de trabalho colaborativo",
          },
          {
            src: "/images/projeto-miguel/miguel-4.jpeg?height=500&width=900",
            alt: "Sala de reuniões",
          },
          {
            src: "/images/projeto-miguel/miguel-5.jpeg?height=600&width=400",
            alt: "Detalhe do mobiliário",
          },
          {
            src: "/images/projeto-miguel/miguel-7.jpeg?height=600&width=400",
            alt: "Detalhe do mobiliário",
          },
          {
            src: "/images/projeto-miguel/miguel-9.jpeg?height=600&width=400",
            alt: "Detalhe do mobiliário",
          },
        ],
      },

    ],
  },
]

// Componente de galeria com zoom
const ProjectGallery = ({ project }) => {
  if (!project) return null
  const { layout, images } = project
  const [zoomedImage, setZoomedImage] = useState(null)

  const renderImage = (image, index, height = 300, extraClasses = "") => (
    <div
      key={index}
      className={`relative h-[${height}px] group overflow-hidden cursor-zoom-in ${extraClasses}`}
      onClick={() => setZoomedImage(image)}
    >
      <Image
        src={image.src || "/placeholder.svg"}
        alt={image.alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </div>)

    useEffect(() => {
      if (zoomedImage) {
        // Bloqueia o scroll
        document.body.style.overflow = "hidden"

        // Função que escuta o ESC
        const handleKeyDown = (e) => {
          if (e.key === "Escape") setZoomedImage(null)
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
          // Remove listener e volta o scroll ao normal
          window.removeEventListener("keydown", handleKeyDown)
          document.body.style.overflow = ""
        }
      }
    }, [zoomedImage])


  return (
    <>
      {zoomedImage && <ImageModal image={zoomedImage} onClose={() => setZoomedImage(null)} />}


      {/* Layouts */}
      {layout === "layout-1" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">{renderImage(images[0], 0, 500)}</div>
          <div className="grid grid-cols-1 gap-4">
            {renderImage(images[1], 1, 240)}
            {renderImage(images[2], 2, 240)}
          </div>
        </div>
      )}

      {layout === "layout-2" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {renderImage(images[0], 0, 400, "md:col-span-8")}
          {renderImage(images[1], 1, 400, "md:col-span-4")}
          {renderImage(images[2], 2, 350, "md:col-span-4")}
          {renderImage(images[3], 3, 350, "md:col-span-4")}
          {renderImage(images[4], 4, 350, "md:col-span-4")}
        </div>
      )}

      {layout === "layout-4" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderImage(images[0], 0, 656)}
          <div className="grid grid-cols-1 gap-4">
            {renderImage(images[1], 1, 290)}
            {renderImage(images[2], 2, 350)}
          </div>
        </div>
      )}

      {layout === "layout-5" && (
        <div className="grid md:grid-cols-2 gap-4">
          {renderImage(images[0], 0, 500)}
          {renderImage(images[1], 1, 500)}
        </div>
      )}

      {!["layout-1", "layout-2", "layout-4", "layout-5"].includes(layout) && (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {images.map((img, index) => renderImage(img, index, index === 0 && images.length > 1 ? 600 : 400))}
        </div>
      )}
    </>
  )

  


}

// Página principal
const ProjectsPage = () => {
  return (
    <main className="min-h-screen bg-white pt-20 ">

    <header className="py-12 px-4 md:px-8 bg-[#f0f0f0]">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <Link href="/" className="inline-flex items-center text-black/70 hover:text-black mb-6 group">
              <ChevronLeft className="w-4 h-4 mr-1 transition-transform duration-300 group-hover:-translate-x-1" />
              Voltar para a página inicial
            </Link>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="text-4xl md:text-5xl font-light mb-4">Projetos</h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-black/70 text-lg max-w-2xl">
              Conheça alguns dos projetos desenvolvidos, cada um com sua própria identidade e soluções personalizadas
              para atender às necessidades específicas de cada cliente.
            </p>
          </FadeIn>
        </div>
      </header>

      <div className="py-16 px-4 md:px-8">
      {projectCategories.map((category, categoryIndex) => (
        <FadeIn delay={0.1 * categoryIndex} key={category.id}>
          <section className="mb-20 max-w-7xl mx-auto">
            <h2 className="text-3xl font-light mb-12 text-black">{category.title}</h2>

            <div className="space-y-24">
              {category.projects.map((project, projectIndex) => (
                <FadeIn key={project.id} delay={0.2 + 0.1 * projectIndex}>
                  <div className="grid gap-8">
                    <div className="max-w-3xl">
                      <h3 className="text-2xl font-light mb-4">{project.title}</h3>
                      <p className="text-black/70 mb-8">{project.description}</p>
                    </div>

                    <FadeIn delay={0.3 + 0.1 * projectIndex}>
                      <ProjectGallery project={project} />
                    </FadeIn>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>
        </FadeIn>
      ))}

      </div>

      <footer className="py-12 text-center text-black/60 border-t border-black/10">
        <p>© {new Date().getFullYear()} Rafaela Andrade - Arquitetura de Interiores.</p>
      </footer>
    </main>
  )
}

export default ProjectsPage
