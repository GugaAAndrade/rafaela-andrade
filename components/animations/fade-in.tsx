"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  duration?: number
  className?: string
  once?: boolean
  distance?: number
}

export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  duration = 0.5,
  className = "",
  once = true,
  distance = 20,
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once && ref.current) {
            observer.unobserve(ref.current)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [once])

  const getDirectionAnimation = () => {
    switch (direction) {
      case "up":
        return { y: isVisible ? 0 : distance }
      case "down":
        return { y: isVisible ? 0 : -distance }
      case "left":
        return { x: isVisible ? 0 : distance }
      case "right":
        return { x: isVisible ? 0 : -distance }
      case "none":
        return {}
      default:
        return { y: isVisible ? 0 : distance }
    }
  }

  // Otimização para melhor performance
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...getDirectionAnimation() }}
      animate={{ opacity: isVisible ? 1 : 0, ...getDirectionAnimation() }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={className}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  )
}
