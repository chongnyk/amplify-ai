"use client"

import { useState } from "react"
import type { Flashcard as FlashcardType } from "../../lib/flashcards"

interface FlashcardProps {
  flashcard: FlashcardType
  isActive?: boolean
}

export function Flashcard({ flashcard, isActive = true }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  // Reset flip state when card changes
  useState(() => {
    setIsFlipped(false)
  })

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto">
      <div
        className={`relative w-full h-64 transition-all duration-700 transform-style-preserve-3d ${
          isActive ? "cursor-pointer" : "cursor-default"
        } ${isFlipped ? "rotate-y-180" : ""}`}
        onClick={() => isActive && setIsFlipped(!isFlipped)}
      >
        {/* Front of card (Question) */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex flex-col justify-center items-center h-full p-6 text-white">
            {flashcard.category && (
              <span className="text-sm font-medium opacity-80 mb-2 bg-white/20 px-3 py-1 rounded-full">
                {flashcard.category}
              </span>
            )}
            <h2 className="text-xl font-semibold text-center leading-relaxed">{flashcard.keyword}</h2>
            {isActive && <p className="text-sm opacity-75 mt-4">Click to reveal answer</p>}
          </div>
        </div>

        {/* Back of card (Answer) */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex flex-col justify-center items-center h-full p-6 text-white">
            <div className="text-sm font-medium opacity-80 mb-4">Answer</div>
            <h2 className="text-2xl font-bold text-center leading-relaxed">{flashcard.definition}</h2>
            <h2 className="text-2xl font-bold text-center leading-relaxed">{flashcard.pronunciation}</h2>
            {isActive && <p className="text-sm opacity-75 mt-4">Click to see question</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
