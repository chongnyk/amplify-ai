import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data, conversationHandler, crossRegionModel, model } from "./data/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth,
  data,
  conversationHandler,
});

// Add IAM permissions for the conversation handler to access Bedrock models
// This assumes you're deploying in us-east-2 region (based on your error logs)
// Replace [your-account-number] with your actual AWS account number
backend.conversationHandler.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    resources: [
      // ARN for the cross-region inference profile
      `arn:aws:bedrock:us-east-2:252955337657:inference-profile/${crossRegionModel}`,
      // ARNs for the foundation model in multiple regions
      `arn:aws:bedrock:us-east-1::foundation-model/${model}`,
      `arn:aws:bedrock:us-west-2::foundation-model/${model}`,
      `arn:aws:bedrock:us-east-2::foundation-model/${model}`,
    ],
    actions: [
      'bedrock:InvokeModelWithResponseStream'
    ],
  })
);