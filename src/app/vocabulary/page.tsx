"use client"

import { useState } from "react"
import { Authenticator } from "@aws-amplify/ui-react";
import Link from 'next/link';
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/themeToggle"
import { FlashcardCarousel } from "@/components/cards/flashcardCarousel"
import { ProgressBar } from "@/components/cards/progressBar"
import { flashcards } from "@/lib/flashcards"
import { useKeyboardNavigation } from "@/hooks/useKeyboardNav"
import { useSwipe } from "@/hooks/useSwipe"

function VocabularyPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cards, setCards] = useState(flashcards)

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length)
  }

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
  }

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setCurrentIndex(0)
  }

  const resetCards = () => {
    setCards(flashcards)
    setCurrentIndex(0)
  }

  // Keyboard navigation
  useKeyboardNavigation({
    onNext: nextCard,
    onPrev: prevCard,
  })

  // Touch/swipe navigation
  useSwipe({
    onSwipeLeft: nextCard,
    onSwipeRight: prevCard,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-blue-800 dark:to-blue-200">
      {/* <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              ← Back to Home
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">Reading Practice</h1>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto p-8">
          <div className="text-center">
            <span className="text-6xl mb-4 block">📖</span>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Reading Practice</h2>
            <p className="text-gray-600 mb-8">
              This feature is coming soon! It will include graded texts and comprehension exercises.
            </p>
            <Link 
              href="/chat"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Try the AI Tutor Instead
            </Link>
          </div>
        </div>
      </div> */}

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Flashcards</h1>
          <p className="text-gray-600 dark:text-gray-300">Test your knowledge with interactive flashcards</p>
        </div>

        <ProgressBar current={currentIndex + 1} total={cards.length} />

        <div className="mb-8">
          <FlashcardCarousel flashcards={cards} currentIndex={currentIndex} onIndexChange={setCurrentIndex} />
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={prevCard} disabled={cards.length <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm text-muted-foreground min-w-[100px] text-center">
            {currentIndex + 1} of {cards.length}
          </span>

          <Button variant="outline" size="icon" onClick={nextCard} disabled={cards.length <= 1}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={shuffleCards} className="gap-2 bg-transparent">
            <Shuffle className="h-4 w-4" />
            Shuffle
          </Button>
          <Button variant="outline" onClick={resetCards} className="gap-2 bg-transparent">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center mt-8 text-sm text-muted-foreground space-y-1">
          <p>Click on the center flashcard to flip it and reveal the answer</p>
          <p>Swipe left/right or use arrow keys to navigate between cards</p>
          <p>Click on side cards or indicators to jump to specific cards</p>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Authenticator>
      <VocabularyPage />
    </Authenticator>
  );
}