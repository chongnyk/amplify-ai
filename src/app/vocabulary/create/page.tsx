"use client"

import { useState } from "react"
import { Authenticator } from "@aws-amplify/ui-react"
import { useRouter } from "next/navigation"
import { client } from "@/client"
import { DeckForm } from "@/components/forms/deckForm"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme/themeToggle"
import type { Schema } from "../../../../amplify/data/resource"

function CreateDeckPage() {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (deckData: Schema["Deck"]["createType"]) => {
    setCreating(true)
    setError(null)
    
    try {
      const { data: newDeck } = await client.models.Deck.create({
        title: deckData.title,
        description: deckData.description,
        difficulty: deckData.difficulty,
      })
      
      if (newDeck) {
        // Redirect to edit page to add flashcards
        router.push(`/vocabulary/decks/${newDeck.id}/edit`)
      }
    } catch (error) {
      console.error('Error creating deck:', error)
      setError('Failed to create deck. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  const handleCancel = () => {
    router.push('/vocabulary')
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
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Create New Deck</h1>
            <p className="text-gray-200">Create a new flashcard deck to start learning</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6" style={{margin: "0 2rem"}}>
            <DeckForm
              mode="create"
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              disabled={creating}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Authenticator>
      <CreateDeckPage />
    </Authenticator>
  )
}
