// src/app/page.tsx
'use client'
import { Authenticator } from "@aws-amplify/ui-react";
import Link from 'next/link';
import { ThemeToggle } from "@/components/theme/themeToggle";
//import { useState } from 'react';

// Feature cards data
const features = [
  {
    id: 'chat',
    title: 'AI Japanese Tutor',
    description: 'Practice Japanese with AI-powered conversations, grammar exercises, and reading comprehension.',
    icon: '🎌',
    href: '/chat',
    color: 'bg-blue-500',
    features: ['Grammar exercises', 'Reading comprehension', 'Example sentences', 'N3 level support']
  },
  {
    id: 'vocabulary',
    title: 'Vocabulary Builder',
    description: 'Build your Japanese vocabulary with flashcards and spaced repetition.',
    icon: '📚',
    href: '/vocabulary',
    color: 'bg-green-500',
    features: ['Flashcards', 'Spaced repetition', 'Progress tracking', 'Custom word lists']
  },
  {
    id: 'grammar',
    title: 'Grammar Guide',
    description: 'Comprehensive grammar lessons with examples and practice exercises.',
    icon: '📝',
    href: '/grammar',
    color: 'bg-purple-500',
    features: ['Grammar patterns', 'Interactive exercises', 'Level progression', 'Detailed explanations']
  },
  {
    id: 'reading',
    title: 'Reading Practice',
    description: 'Improve your reading skills with graded texts and comprehension exercises.',
    icon: '📖',
    href: '/reading',
    color: 'bg-orange-500',
    features: ['Graded texts', 'Comprehension questions', 'Vocabulary hints', 'Progress tracking']
  }
];

function FeatureCard({ feature }: { feature: typeof features[0] }) {
  return (
    <Link href={feature.href} className="block group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 group-hover:border-blue-300">
        <div className="flex items-start space-x-4">
          <div className={`${feature.color} p-3 rounded-lg flex-shrink-0`}>
            <span className="text-2xl">{feature.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              {feature.description}
            </p>
            <ul className="space-y-1">
              {feature.features.map((item, index) => (
                <li key={index} className="text-xs text-gray-500 flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-blue-500 group-hover:text-blue-700 transition-colors">
            →
          </div>
        </div>
      </div>
    </Link>
  );
}

function HomePage() {
  // const [user, _setUser] = useState(null);
  // console.log('Current user:', user);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎌</span>
              <h1 className="text-xl font-bold text-gray-800">Japanese Learning Hub</h1>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/chat" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Chat Tutor
                </Link>
                <Link href="/vocabulary" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Vocabulary
                </Link>
                <Link href="/grammar" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Grammar
                </Link>
                <Link href="/reading" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Reading
                </Link>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Master Japanese with AI-Powered Learning
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Enhance your Japanese language skills with personalized AI tutoring, 
            interactive exercises, and comprehensive learning tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/chat"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Start Learning Now
            </Link>
            <button className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg font-medium border border-gray-300 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Learning Tools</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive set of Japanese learning tools, 
              each designed to help you progress at your own pace.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Vocabulary Words</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Grammar Patterns</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">AI Tutor Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-400">
              © 2025 Japanese Learning Hub. Powered by AI technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Page() {
  return (
    <Authenticator>
      <HomePage />
    </Authenticator>
  );
}