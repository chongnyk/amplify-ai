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
    <div className="w-[450px] h-[300px] mx-auto">
      <div
        className={`w-full h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg ${
          isActive ? "cursor-pointer hover:shadow-xl" : "cursor-default"
        } transition-shadow`}
        onClick={() => isActive && setIsFlipped(!isFlipped)}
      >
        {!isFlipped ? (
          // Front of card (Question)
          <div className="flex flex-col justify-center items-center h-full min-h-full p-8 text-center">
            {flashcard.category && (
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                {flashcard.category}
              </span>
            )}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{flashcard.keyword}</h2>
            {isActive && <p className="text-sm text-gray-500 dark:text-gray-400">Click to reveal answer</p>}
          </div>
        ) : (
          // Back of card (Answer)
          <div className="flex flex-col justify-center items-center h-full min-h-full p-8 text-center">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              Answer
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{flashcard.definition}</h2>
            <h3 className="text-lg text-gray-700 dark:text-gray-300 mb-6">{flashcard.pronunciation}</h3>
            {isActive && <p className="text-sm text-gray-500 dark:text-gray-400">Click to see question</p>}
          </div>
        )}
      </div>
    </div>
  )
}
