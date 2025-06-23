// src/app/chat/page.tsx
'use client'
import { Authenticator } from "@aws-amplify/ui-react";
import { AIConversation } from '@aws-amplify/ui-react-ai';
import { useAIConversation } from "../../client";
import { useState } from 'react';
import Link from 'next/link';

// Quick chat options configuration
const quickChatOptions = [
  {
    id: '統合',
    label: '統合',
    message: 'Can you generate some example sentences using the word 統合 and explain these sentences?',
    icon: '👋',
    category: 'general',
    description: 'Example Sentences'
  },
  {
    id: '背景',
    label: '背景',
    message: 'Can you generate some example sentences using the word 背景 and explain these sentences?',
    icon: '🍳',
    category: 'general',
    description: 'Example Sentences'
  },
  {
    id: '環境',
    label: '環境',
    message: 'Can you generate a short reading comprehension exercise using the word 環境?',
    icon: '🥗',
    category: 'general',
    description: 'Reading Comprehension'
  },
  {
    id: 'なるべく',
    label: 'なるべく',
    message: 'Can you generate a multiple choice exercise for the user to select the correct usage of なるべく?',
    icon: '💡',
    category: 'grammar',
    description: 'Grammar Exercise'
  },
  {
    id: 'ように',
    label: 'ように',
    message: 'Can you generate a multiple choice exercise for the user to select the correct usage of ように?',
    icon: '🥘',
    category: 'grammar',
    description: 'Grammar Exercise'
  },
  {
    id: 'N3',
    label: 'N3',
    message: 'Can you generate a reading comprehension exercise for N3-level Japanese students?',
    icon: '📅',
    category: 'general',
    description: 'Reading Comprehension'
  }
];

// Quick Action Button Component
function QuickActionButton({ option, onSelect, isLoading }: {
  option: typeof quickChatOptions[0];
  onSelect: (message: string) => void;
  isLoading: boolean;
}) {
  return (
    <button
      onClick={() => onSelect(option.message)}
      disabled={isLoading}
      className="flex items-start space-x-3 p-4 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group text-left w-full"
    >
      <div className="flex-shrink-0 text-2xl">{option.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 group-hover:text-blue-700 text-sm">
          {option.label}
        </div>
        <div className="text-xs text-gray-500 mt-1 line-clamp-2">
          {option.description}
        </div>
      </div>
    </button>
  );
}

// Enhanced Chat Component with Quick Actions
function ChatComponent() {
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation('chat');

  const [showQuickActions, setShowQuickActions] = useState(true);

  // Handle quick action selection
  const handleQuickAction = (message: string) => {
    handleSendMessage({ content: [{ text: message }] });
    // Hide quick actions after first message (optional)
    setShowQuickActions(false);
  };

  // Show quick actions if no messages or user wants to see them
  const shouldShowQuickActions = showQuickActions && messages.length === 0;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              ← Back to Home
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">AI Japanese Tutor</h1>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              ⚡ Quick Actions
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Quick Actions Sidebar (visible when no messages or toggled on) */}
        {(shouldShowQuickActions || (showQuickActions && messages.length > 0)) && (
          <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Quick Actions</h2>
              <p className="text-sm text-gray-600">
                Click any option below to start a conversation instantly!
              </p>
            </div>
            
            <div className="space-y-3">
              {quickChatOptions.map((option) => (
                <QuickActionButton
                  key={option.id}
                  option={option}
                  onSelect={handleQuickAction}
                  isLoading={isLoading}
                />
              ))}
            </div>

            {/* Floating Quick Actions for Mobile */}
            <div className="mt-6 md:hidden">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Chips</h3>
              <div className="flex flex-wrap gap-2">
                {quickChatOptions.slice(0, 4).map((option) => (
                  <button
                    key={`chip-${option.id}`}
                    onClick={() => handleQuickAction(option.message)}
                    disabled={isLoading}
                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {option.icon} {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Welcome Message (shown when no messages) */}
          {messages.length === 0 && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💬</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome to AI Japanese Tutor!
                </h2>
                <p className="text-gray-600 mb-6">
                  I&apos;m here to help you learn Japanese through conversation, grammar exercises, and reading comprehension. 
                  Get started by clicking a quick action or typing your own message.
                </p>
                {/* Mobile Quick Actions */}
                <div className="md:hidden space-y-2">
                  {quickChatOptions.slice(0, 3).map((option) => (
                    <button
                      key={`mobile-${option.id}`}
                      onClick={() => handleQuickAction(option.message)}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <span>{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Conversation Component */}
          <div className={messages.length === 0 ? 'hidden md:block' : 'flex-1'}>
            <AIConversation
              messages={messages}
              isLoading={isLoading}
              handleSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </div>

      {/* Floating Quick Actions (when chat is active) */}
      {messages.length > 0 && !showQuickActions && (
        <div className="fixed bottom-20 right-4 md:hidden">
          <button
            onClick={() => setShowQuickActions(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors"
          >
            ⚡
          </button>
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Authenticator>
      <ChatComponent />
    </Authenticator>
  );
}