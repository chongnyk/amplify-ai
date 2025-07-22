import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

// Configure Amplify
Amplify.configure(outputs);

export const client = generateClient<Schema>({ authMode: "userPool" });
export const { useAIConversation, useAIGeneration } = createAIHooks(client);