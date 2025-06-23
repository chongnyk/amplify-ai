import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { defineConversationHandlerFunction } from "@aws-amplify/backend-ai/conversation";

// Define the model and cross-region model
export const model = 'anthropic.claude-3-5-haiku-20241022-v1:0';
export const crossRegionModel = `us.${model}`;

// Define the conversation handler
export const conversationHandler = defineConversationHandlerFunction({
  entry: "./conversationHandler.ts",
  name: "conversationHandler",
  models: [{ modelId: crossRegionModel }],
});

const schema = a.schema({
  chat: a.conversation({
    aiModel: {
      resourcePath: crossRegionModel,
    },
    systemPrompt: 'You are a Japanese language teacher',
    handler: conversationHandler,
  })
  .authorization((allow) => allow.owner()),
    
  generateRecipe: a.generation({
    aiModel: a.ai.model('Claude 3.5 Haiku'), // Keep this as-is for now
    systemPrompt: 'You are a helpful assistant that generates recipes.',
  })
  .arguments({
    description: a.string(),
  })
  .returns(
    a.customType({
      name: a.string(),
      ingredients: a.string().array(),
      instructions: a.string(),
    })
  )
  .authorization((allow) => allow.authenticated()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()