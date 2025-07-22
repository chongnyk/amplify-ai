"use client"

import { useState, useEffect } from "react"
import { Authenticator } from "@aws-amplify/ui-react";
//import { generateClient } from "aws-amplify/data"; // Add this
import { client } from "@/client";
//import type { Schema } from "../../../../../amplify/data/resource"; // Add this
import Link from 'next/link';
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/themeToggle"
import { FlashcardCarousel } from "@/components/cards/flashcardCarousel"
import { ProgressBar } from "@/components/cards/progressBar"

import { useKeyboardNavigation } from "@/hooks/useKeyboardNav"
import { useSwipe } from "@/hooks/useSwipe"
// vocabulary/decks/[id]/page.tsx
import { useParams } from 'next/navigation'
import type { Schema } from "../../../../../amplify/data/resource"

type DeckData = Schema["Deck"]["createType"]
type FlashcardData = Schema["Flashcard"]["createType"]

// Amplify should be configured in client.ts - removing duplicate config

function DeckPage() {
  const params = useParams()
  const deckId = params.id as string // This gets the [id] from URL
  
  // Your existing state
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cards, setCards] = useState<FlashcardData[]>([]) // Start with empty array
  const [loading, setLoading] = useState(true)
  const [deck, setDeck] = useState<DeckData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDeck = async () => {
      try {
        const { data: deckData } = await client.models.Deck.get({
          id: deckId
        })

        if (deckData) {
          console.log('Deck data:', deckData) // Debug log
          setDeck(deckData)
          
          // Fetch flashcards separately for this deck
          const { data: flashcardsData } = await client.models.Flashcard.list({
            filter: { deckId: { eq: deckId } }
          })
          
          console.log('Flashcards data:', flashcardsData) // Debug log
          setCards(flashcardsData || [])
        }
      } catch (error) {
        console.error('Error loading deck:', error)
        setError('Failed to load deck. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadDeck()
  }, [deckId])

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
    // Reset to original deck order (you might want to store original cards separately)
    if (deck) {
      const loadDeck = async () => {
        const { data: flashcardsData } = await client.models.Flashcard.list({ 
          filter: { deckId: { eq: deckId } }
        })
        setCards(flashcardsData || [])
        setCurrentIndex(0)
      }
      loadDeck()
    }
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br dark:to-[#7c3aed] flex items-center justify-center" style={{
        background: "#1F2937",
      }}>
        <div className="text-white text-xl">Loading deck...</div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center" style={{
        background: "#1F2937",
      }}>
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-xl mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Deck not found check
  if (!deck) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center" style={{
        background: "#1F2937",
      }}>
        <div className="text-white text-xl">Deck not found</div>
      </div>
    )
  }

  // Empty cards check
  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center" style={{
        background: "#1F2937",
      }}>
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">{deck.title}</h2>
          <p className="text-xl">No flashcards found in this deck</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br" style={{
      background: "#1F2937",
    }}>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="absolute top-4 left-4">
        <Link href="/vocabulary">
          <Button variant="outline" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Decks
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{deck.title}</h1>
          <p className="text-gray-600 dark:text-gray-300">{deck.description || 'Test your knowledge with interactive flashcards'}</p>
        </div>

        <ProgressBar current={currentIndex + 1} total={cards.length} />

        <div className="mb-8">
          <FlashcardCarousel
            flashcards={cards
              .filter(card => card && card.id !== undefined && card.id !== null)
              .map(card => ({
                ...card,
                id: Number(card.id),
                pronunciation: card.pronunciation ?? undefined,
                category: card.category ?? undefined,
                // add similar lines for any other nullable fields expected as string | undefined
              }))}
            currentIndex={currentIndex}
            onIndexChange={setCurrentIndex}
          />
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
      <DeckPage />
    </Authenticator>
  );
}