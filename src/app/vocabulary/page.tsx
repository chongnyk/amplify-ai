"use client"

import { useState, useEffect } from "react"
import { Authenticator } from "@aws-amplify/ui-react";
import { client } from "@/client";
import Link from 'next/link';
import { ChevronRight, Plus, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/themeToggle"
import { useRouter } from "next/navigation";
import type { Schema } from "../../../amplify/data/resource"

type DeckData = Schema["Deck"]["createType"]

// Amplify should be configured in client.ts - removing duplicate config

function VocabularyPage() {
  const [decks, setDecks] = useState<DeckData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();

  useEffect(() => {
    const loadDecks = async () => {
      try {
        console.log('Client:', client) // Debug log
        console.log('Client models:', client.models) // Debug log
        console.log('Available models:', Object.keys(client.models || {})) // Debug log
        console.log('Deck model:', client.models?.Deck) // Debug log
        
        const { data: decksData } = await client.models.Deck.list()
        console.log('Decks data:', decksData) // Debug log
        setDecks(decksData || [])
      } catch (error) {
        console.error('Full error details:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        setError(`Failed to load decks: ${errorMessage}`)
      } finally {
        setLoading(false)
      }
    }

    loadDecks()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: "#1F2937",
      }}>
        <div className="text-white text-xl">Loading decks...</div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
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

  return (
    <div className="min-h-screen" style={{
      background: "#1F2937",
    }}>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="absolute top-4 left-4">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            ← Back to Home
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Vocabulary Decks</h1>
          <p className="text-gray-600 dark:text-gray-300">Choose a deck to start studying</p>
        </div>

        {decks.length === 0 ? (
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">No Decks Found</h2>
            <p className="text-xl mb-6">Create your first deck to get started!</p>
            <Link href="/vocabulary/create">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Deck
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Your Decks</h2>
              <Link href="/vocabulary/create">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Deck
                </Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 mx-auto" style={{ gap: '24px', maxWidth: '700px', width: '90%' }}>
              {decks.map((deck) => (
              <Link key={deck.id} href={`/vocabulary/decks/${deck.id}`}>
                <div className="bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-all duration-200 cursor-pointer border border-white/20" style={{ padding: '24px' }}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-white">{deck.title}</h3>
                    <button onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/vocabulary/decks/${deck.id}/edit`);
                    }}>
                      <MoreVertical className="h-5 w-5 text-white/70"/>
                    </button>
                    <ChevronRight className="h-5 w-5 text-white/70" />
                  </div>
                  
                  <p className="text-white/80 mb-4 line-clamp-2">
                    {deck.description || 'No description available'}
                  </p>
                  
                  <div className="flex justify-between items-center text-sm text-white/70">
                    <span className="px-2 py-1 bg-white/20 rounded-full">
                      {deck.difficulty || 'Beginner'}
                    </span>
                    <span>
                      {/* We'll show card count when we have the relationship working */}
                      Study Now →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            </div>
          </div>
        )}
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