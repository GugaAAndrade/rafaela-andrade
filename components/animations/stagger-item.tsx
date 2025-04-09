"use client"

import type React from "react"

import { motion } from "framer-motion"

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right" | "none"
  distance?: number
}

export default function StaggerItem({ children, className = "", direction = "up", distance = 20 }: StaggerItemProps) {
  const getDirectionAnimation = () => {
    switch (direction) {
      case "up":
        return { y: distance }
      case "down":
        return { y: -distance }
      case "left":
        return { x: distance }
      case "right":
        return { x: -distance }
      case "none":
        return {}
      default:
        return { y: distance }
    }
  }

  const item = {
    hidden: { opacity: 0, ...getDirectionAnimation() },
    show: { opacity: 1, y: 0, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  )
}
