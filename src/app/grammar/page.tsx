// src/app/grammar/page.tsx
'use client'
import { Authenticator } from "@aws-amplify/ui-react";
import Link from 'next/link';

function GrammarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-4">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            ← Back to Home
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">Grammar Guide</h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">
          <span className="text-6xl mb-4 block">📝</span>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Grammar Guide</h2>
          <p className="text-gray-600 mb-8">
            This feature is coming soon! It will include comprehensive grammar lessons and interactive exercises.
          </p>
          <Link 
            href="/chat"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Try the AI Tutor Instead
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Authenticator>
      <GrammarPage />
    </Authenticator>
  );
}