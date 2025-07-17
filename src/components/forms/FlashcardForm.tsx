"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Schema } from "../../../amplify/data/resource"

type FlashcardCreateData = Schema["Flashcard"]["createType"]

// components/forms/FlashcardForm.tsx
interface FlashcardFormProps {
    mode: 'create' | 'edit'
    deckId: string
    initialData?: any
    onSubmit: (data: FlashcardCreateData) => void
    onCancel: () => void
  }
  
  export function FlashcardForm({ mode, deckId, initialData, onSubmit, onCancel }: FlashcardFormProps) {
    const [formData, setFormData] = useState({
      keyword: initialData?.keyword || '',
      pronunciation: initialData?.pronunciation || '',
      definition: initialData?.definition || '',
      category: initialData?.category || '',
      deckId: deckId
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit(formData)
    }
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {mode === 'create' ? 'Add New Flashcard' : 'Edit Flashcard'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="keyword" className="block text-sm font-medium mb-1">
                Keyword *
              </label>
              <input
                id="keyword"
                type="text"
                value={formData.keyword}
                onChange={(e) => setFormData(prev => ({ ...prev, keyword: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Enter the word or phrase"
                required
              />
            </div>
  
            <div>
              <label htmlFor="pronunciation" className="block text-sm font-medium mb-1">
                Pronunciation
              </label>
              <input
                id="pronunciation"
                type="text"
                value={formData.pronunciation}
                onChange={(e) => setFormData(prev => ({ ...prev, pronunciation: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="How to pronounce it"
              />
            </div>
  
            <div>
              <label htmlFor="definition" className="block text-sm font-medium mb-1">
                Definition *
              </label>
              <textarea
                id="definition"
                value={formData.definition}
                onChange={(e) => setFormData(prev => ({ ...prev, definition: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 h-24 resize-none focus:outline-none focus:border-blue-500"
                placeholder="Enter the meaning or translation"
                required
              />
            </div>
  
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Category
              </label>
              <input
                id="category"
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="e.g., Verb, Noun, Adjective"
              />
            </div>
  
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {mode === 'create' ? 'Add Flashcard' : 'Update Flashcard'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }