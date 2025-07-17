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

function CreateDeckPage() {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (deckData: any) => {
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
    <div className="min-h-screen bg-gradient-to-br from-[#1e40af] to-[#60a5fa] dark:from-[#581c87] dark:to-[#7c3aed]">
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

          <div className="bg-white rounded-lg shadow-lg p-6">
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
