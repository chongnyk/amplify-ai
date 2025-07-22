import { client } from "@/client"
import { useEffect, useState } from "react"
import { FlashcardForm } from "./FlashcardForm"
import { Button } from "../ui/button"
import type { Schema } from "../../../amplify/data/resource"

type FlashcardData = Schema["Flashcard"]["createType"]

// components/forms/FlashcardManager.tsx
interface FlashcardManagerProps {
    deckId: string
    onFlashcardChange?: () => void // Callback when flashcards are updated
  }
  
  export function FlashcardManager({ deckId, onFlashcardChange }: FlashcardManagerProps) {
    // State for flashcards list
    const [flashcards, setFlashcards] = useState<FlashcardData[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingFlashcard, setEditingFlashcard] = useState<FlashcardData | null>(null)
  
    // Load flashcards for this deck
    useEffect(() => {
      const loadFlashcards = async () => {
        const { data } = await client.models.Flashcard.list({
          filter: { deckId: { eq: deckId } }
        })
        setFlashcards(data || [])
        setLoading(false)
      }
      loadFlashcards()
    }, [deckId])
  
    // Delete flashcard
    const handleDelete = async (flashcardId: string) => {
      await client.models.Flashcard.delete({ id: flashcardId })
      setFlashcards(prev => prev.filter(card => card.id !== flashcardId))
      onFlashcardChange?.()
    }
  
    // Add new flashcard
    const handleAdd = () => {
      console.log('Add button clicked!') // Debug log
      setShowAddForm(true)
      console.log('showAddForm set to true') // Debug log
    }
  
    // Edit existing flashcard
    const handleEdit = (flashcard: FlashcardData) => {
      setEditingFlashcard(flashcard)
    }

    if (loading) {
      return <div>Loading flashcards...</div>
    }
  
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Flashcards ({flashcards.length})</h3>
          <Button onClick={handleAdd}>+ Add Flashcard</Button>
        </div>
  
        {/* Flashcard List */}
        <div className="space-y-2">
          {flashcards.map(flashcard => (
            <div key={flashcard.id} className="border rounded p-3 flex justify-between">
              <div>
                <div className="font-medium">{flashcard.keyword}</div>
                <div className="text-sm text-gray-600">
                  {flashcard.pronunciation || 'No pronunciation'}
                </div>
                {flashcard.category && (
                  <div className="text-xs text-gray-500 mt-1">
                    Category: {flashcard.category}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(flashcard)}>
                  Edit
                </Button>
                {flashcard.id && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(flashcard.id as string)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
  
        {/* Add/Edit Form Modal */}
        {(showAddForm || editingFlashcard) && (
          <FlashcardForm
            mode={editingFlashcard ? 'edit' : 'create'}
            deckId={deckId}
            initialData={editingFlashcard ?? undefined}
            onSubmit={async (data) => {
              if (editingFlashcard) {
                await client.models.Flashcard.update({
                  id: editingFlashcard.id,
                  ...data
                })
              } else {
                await client.models.Flashcard.create(data)
              }
              // Refresh flashcards
              const { data: updated } = await client.models.Flashcard.list({
                filter: { deckId: { eq: deckId } }
              })
              setFlashcards(updated || [])
              setShowAddForm(false)
              setEditingFlashcard(null)
              onFlashcardChange?.()
            }}
            onCancel={() => {
              setShowAddForm(false)
              setEditingFlashcard(null)
            }}
          />
        )}
      </div>
    )
  }