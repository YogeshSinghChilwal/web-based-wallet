"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface ThemeToggleProps {
  /**
   * Where the animation should originate from.
   * "button": From the center of the toggle button (default).
   * "top-left": From the top-left corner of the viewport.
   * "top-right": From the top-right corner of the viewport.
   * "bottom-left": From the bottom-left corner of the viewport.
   * "bottom-right": From the bottom-right corner of the viewport.
   * "center": From the center of the viewport.
   */
  animationOrigin?: "button" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  /**
   * The duration of the animation in milliseconds.
   * Default is 500ms.
   */
  animationDuration?: number;
}

export function ThemeToggle({ animationOrigin = "button", animationDuration = 500 }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-9 px-0">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  const toggleTheme = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    
    const button = document.querySelector('[data-theme-toggle]') as HTMLElement
    
    let centerX: number
    let centerY: number

    if (animationOrigin === "button" && button) {
      const rect = button.getBoundingClientRect()
      centerX = rect.left + rect.width / 2
      centerY = rect.top + rect.height / 2
    } else if (animationOrigin === "top-left") {
      centerX = 0
      centerY = 0
    } else if (animationOrigin === "top-right") {
      centerX = window.innerWidth
      centerY = 0
    } else if (animationOrigin === "bottom-left") {
      centerX = 0
      centerY = window.innerHeight
    } else if (animationOrigin === "bottom-right") {
      centerX = window.innerWidth
      centerY = window.innerHeight
    } else { // Default to "center" or fallback if button not found
      centerX = window.innerWidth / 2
      centerY = window.innerHeight / 2
    }

    // Create overlay
    const overlay = document.createElement('div')
    overlay.style.position = 'fixed'
    overlay.style.top = '0'
    overlay.style.left = '0'
    overlay.style.width = '100vw'
    overlay.style.height = '100vh'
    overlay.style.pointerEvents = 'none'
    overlay.style.zIndex = '9999'
    overlay.style.overflow = 'hidden'
    
    // Create the expanding circle
    const circle = document.createElement('div')
    
    // Calculate the maximum distance to cover the entire screen from the origin
    const corners = [
      { x: 0, y: 0 },
      { x: window.innerWidth, y: 0 },
      { x: 0, y: window.innerHeight },
      { x: window.innerWidth, y: window.innerHeight },
    ]
    const maxDistance = Math.max(
      ...corners.map(corner => 
        Math.sqrt(Math.pow(corner.x - centerX, 2) + Math.pow(corner.y - centerY, 2))
      )
    )
    
    circle.style.position = 'absolute'
    circle.style.top = `${centerY}px`
    circle.style.left = `${centerX}px`
    circle.style.width = '0px'
    circle.style.height = '0px'
    circle.style.borderRadius = '50%'
    circle.style.background = isDark ? '#ffffff' : '#0a0a0a'
    circle.style.transform = 'translate(-50%, -50%)'
    circle.style.transition = `all ${animationDuration / 1000}s cubic-bezier(0.4, 0, 0.2, 1)`
    
    overlay.appendChild(circle)
    document.body.appendChild(overlay)
    
    // Start animation
    requestAnimationFrame(() => {
      const size = maxDistance * 2.2 // Factor to ensure full coverage
      circle.style.width = `${size}px`
      circle.style.height = `${size}px`
    })
    
    // Change theme at the midpoint of animation
    setTimeout(() => {
      setTheme(isDark ? 'light' : 'dark')
    }, animationDuration / 2)
    
    // Clean up
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay)
      }
      setIsAnimating(false)
    }, animationDuration)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-9 px-0 relative overflow-hidden transition-all duration-200 hover:bg-accent"
      onClick={toggleTheme}
      data-theme-toggle
      disabled={isAnimating}
    >
      <div className="relative">
        <Sun 
          className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out ${
            isDark 
              ? 'rotate-90 scale-0 opacity-0' 
              : 'rotate-0 scale-100 opacity-100'
          }`} 
        />
        <Moon 
          className={`absolute top-0 left-0 h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out ${
            isDark 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
          }`} 
        />
      </div>
      <span className="sr-only">Toggle theme</span>
      
      {/* Loading indicator during animation */}
      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent opacity-50" />
        </div>
      )}
    </Button>
  )
}
