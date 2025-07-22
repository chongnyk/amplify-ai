"use client"

import { useState, useEffect } from "react"
import { Authenticator } from "@aws-amplify/ui-react"
import { useParams, useRouter } from "next/navigation"
import { client } from "@/client"
import { DeckForm } from "@/components/forms/deckForm"
import { FlashcardManager } from "@/components/forms/flashcardManager"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme/themeToggle"
import type { Schema } from "../../../../../../amplify/data/resource"

type DeckData = Schema["Deck"]["createType"]

function EditDeckPage() {
  const params = useParams()
  const router = useRouter()
  const deckId = params.id as string
  
  const [deck, setDeck] = useState<DeckData | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Load deck data
  useEffect(() => {
    const loadDeck = async () => {
      try {
        const { data: deckData } = await client.models.Deck.get({
          id: deckId
        })
        
        if (deckData) {
          setDeck(deckData)
        } else {
          setError('Deck not found')
        }
      } catch (error) {
        console.error('Error loading deck:', error)
        setError('Failed to load deck')
      } finally {
        setLoading(false)
      }
    }

    loadDeck()
  }, [deckId])

  const handleDeckUpdate = async (deckData: DeckData) => {
    setUpdating(true)
    setError(null)
    setSuccess(null)
    
    try {
      const { data: updatedDeck } = await client.models.Deck.update({
        id: deckId,
        title: deckData.title,
        description: deckData.description,
        difficulty: deckData.difficulty,
      })
      
      if (updatedDeck) {
        setDeck(updatedDeck)
        setSuccess('Deck updated successfully!')
        setTimeout(() => setSuccess(null), 3000)
      }
    } catch (error) {
      console.error('Error updating deck:', error)
      setError('Failed to update deck. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const handleCancel = () => {
    router.push('/vocabulary')
  }

  // Handle flashcard changes (optional callback)
  const handleFlashcardChange = () => {
    // You can add logic here if needed when flashcards change
    console.log('Flashcards updated')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: "#1F2937",
      }}>
        <div className="text-white text-xl">Loading deck...</div>
      </div>
    )
  }

  if (error && !deck) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: "#1F2937",
      }}>
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-xl mb-4">{error}</p>
          <Button onClick={() => router.push('/vocabulary')}>
            Back to Decks
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Edit Deck</h1>
            <p className="text-gray-200">Update your deck and manage flashcards</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg text-green-700">
              {success}
            </div>
          )}

          <div className="space-y-8">
            {/* Deck Information Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Deck Information</h2>
              <DeckForm
                mode="edit"
                initialData={deck ?? undefined}
                onSubmit={handleDeckUpdate}
                onCancel={handleCancel}
                disabled={updating}
              />
            </div>

            {/* Flashcard Management */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <FlashcardManager
                deckId={deckId}
                onFlashcardChange={handleFlashcardChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Authenticator>
      <EditDeckPage />
    </Authenticator>
  )
} 