"use client"

import { AnimatePresence, motion, Variants } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"


// Dados dos projetos para o carrossel
const projects = [
  {
    id: 1,
    title: "Projeto Ares",
    description:
      "A sala apresenta uma linguagem contemporânea limpa, com linhas retas, volumes bem definidos e uma paleta neutra pontuada por texturas naturais. Cada escolha de material, mobiliário e iluminação foi pensada para ampliar a sensação de espaço e liberdade, promovendo bem-estar e equilíbrio visual.",
    image: "/images/projeto-ares/ares-2.jpeg",
  },
  {
    id: 2,
    title: "Proposta de Reforma – Restaurante O Miguel",
    description:
    "A proposta de reforma do restaurante O Miguel teve como objetivo atualizar a identidade visual e funcional do espaço, tornando-o mais acolhedor, eficiente e alinhado com a experiência gastronômica que o local já oferece.",
    image: "/images/projeto-miguel/miguel-5.jpeg?height=500&width=900",
  },
  {
    id: 3,
    title: "Projeto Banheiro Auna",
    description:
      "A base do projeto está ancorada no tom quente do MDF Freijó, aplicado ao mobiliário para criar contraste e sofisticação. Em contraponto, o piso e os revestimentos em Gris Armani introduzem uma estética sóbria e contemporânea, com veios delicados e tonalidade acinzentada que reforçam a elegância do espaço. ",
    image: "/images/projeto-auna/auna-1.jpeg?height=500&width=900",
  },
  {
    id: 4,
    title: "Projeto Quarto Alma",
    description:
      "Neste quarto, forma e função se encontram com equilíbrio, criando uma atmosfera que abraça sem pesar. Mais do que um espaço para descansar, Alma é onde se reconhece a beleza do silêncio, da luz suave e do estar presente.",
    image: "/images/projeto-alma/alma-2.jpeg?height=500&width=900",
  },
]

export default function ProjectCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const nextSlide = () => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex === projects.length - 1 ? 0 : prevIndex + 1))

    setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  const prevSlide = () => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? projects.length - 1 : prevIndex - 1))

    setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  // Auto-play do carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentIndex])


  const variants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  const transition = {
    duration: 0.8,
    ease: [0.4, 0.0, 0.2, 1],
  }

  return (
    <div className="relative">
      {/* Carrossel de imagens */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="absolute inset-0"
          >
            <Image
              src={projects[currentIndex].image || "/placeholder.svg"}
              alt={projects[currentIndex].title}
              fill
              className="object-cover"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Controles do carrossel */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 p-2 rounded-full hover:bg-white transition-colors hover:scale-110 transform duration-300"
          aria-label="Projeto anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 p-2 rounded-full hover:bg-white transition-colors hover:scale-110 transform duration-300"
          aria-label="Próximo projeto"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Descrição do projeto atual */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        key={`desc-${currentIndex}`}
        className="bg-white -mt-20 relative z-20 mx-auto max-w-3xl p-8 shadow-sm"
      >
        <h3 className="text-2xl font-light mb-4">{projects[currentIndex].title}</h3>
        <p className="text-black/70">{projects[currentIndex].description}</p>
      </motion.div>

      {/* Indicadores de slide */}
      <div className="flex justify-center mt-6 gap-2">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              index === currentIndex ? "bg-black w-8" : "bg-black/30 hover:bg-black/50"
            }`}
            aria-label={`Ir para o slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
