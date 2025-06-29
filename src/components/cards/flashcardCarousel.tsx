"use client"

import { useState, useEffect } from "react"
import { Flashcard } from "./flashcard"
import type { Flashcard as FlashcardType } from "../../lib/flashcards"

interface FlashcardCarouselProps {
  flashcards: FlashcardType[]
  currentIndex: number
  onIndexChange: (index: number) => void
}

export function FlashcardCarousel({ flashcards, currentIndex, onIndexChange }: FlashcardCarouselProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Handle smooth transitions
  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 300)
    return () => clearTimeout(timer)
  }, [currentIndex])

  const getVisibleCards = () => {
    const cards = []
    const totalCards = flashcards.length

    // Show 3 cards: previous, current, next
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + totalCards) % totalCards
      cards.push({
        card: flashcards[index],
        offset: i,
        index: index,
      })
    }

    return cards
  }

  const visibleCards = getVisibleCards()

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden">
      <div className="flex items-center justify-center min-h-[300px] px-4">
        {visibleCards.map(({ card, offset, index }) => (
          <div
            key={`${card.id}-${index}`}
            className={`absolute transition-all duration-300 ease-out ${isTransitioning ? "transition-transform" : ""}`}
            style={{
              transform: `translateX(${offset * 100}%) scale(${offset === 0 ? 1 : 0.85})`,
              zIndex: offset === 0 ? 10 : 5 - Math.abs(offset),
              opacity: Math.abs(offset) > 1 ? 0 : offset === 0 ? 1 : 0.6,
            }}
            onClick={() => {
              if (offset !== 0) {
                onIndexChange(index)
              }
            }}
          >
            <div className={`w-80 ${offset !== 0 ? "cursor-pointer" : ""}`}>
              <Flashcard flashcard={card} />
            </div>
          </div>
        ))}
      </div>

      {/* Card indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {flashcards.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? "bg-blue-500 w-6"
                : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
            }`}
            onClick={() => onIndexChange(index)}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
