"use client"

import { useEffect } from "react"

interface UseKeyboardNavigationProps {
  onNext: () => void
  onPrev: () => void
  onFlip?: () => void
}

export function useKeyboardNavigation({ onNext, onPrev, onFlip }: UseKeyboardNavigationProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
        case " ": // Spacebar
          event.preventDefault()
          onNext()
          break
        case "ArrowLeft":
          event.preventDefault()
          onPrev()
          break
        case "ArrowUp":
        case "ArrowDown":
          event.preventDefault()
          onFlip?.()
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [onNext, onPrev, onFlip])
}
