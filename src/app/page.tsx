'use client'
import { Authenticator } from "@aws-amplify/ui-react";
import { AIConversation } from '@aws-amplify/ui-react-ai';
import { useAIConversation } from "../client";

// Create a separate component for the chat that runs inside the authenticated context
function ChatComponent() {
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation('chat');

  return (
    <AIConversation
      messages={messages}
      isLoading={isLoading}
      handleSendMessage={handleSendMessage}
    />
  );
}

export default function Page() {
  return (
    <Authenticator>
      <ChatComponent />
    </Authenticator>
  );
}