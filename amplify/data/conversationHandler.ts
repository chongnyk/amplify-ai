// amplify/data/conversationHandler.ts - Modified Version
import { handleConversationTurnEvent } from '@aws-amplify/backend-ai/conversation/runtime';

// Rate limiting and retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2
};

// Simple in-memory rate limiting (for demo - use DynamoDB in production)
const rateLimitTracker = new Map<string, { count: number; resetTime: number }>();

// Enhanced handler that wraps the default Amplify handler
export const handler = async (event: any) => {
  console.log('Enhanced conversation handler called');
  
  try {
    // Extract user ID for rate limiting
    const userId = event.conversationId || 'anonymous';
    
    // 1. Check rate limits
    if (await isRateLimited(userId)) {
      console.log(`Rate limited user: ${userId}`);
      return createErrorResponse('I am currently experiencing high demand. Please try again in a few moments.');
    }
    
    // 2. Execute with retry logic
    return await executeWithRetry(async () => {
      // Call the original Amplify handler
      return await handleConversationTurnEvent(event);
    });
    
  } catch (error) {
    console.error('Conversation processing failed:', error);
    return handleConversationError(error);
  }
};

// Retry logic with exponential backoff
async function executeWithRetry<T>(operation: () => Promise<T>): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.log(`Attempt ${attempt + 1} failed:`, error);
      
      // Don't retry certain errors
      if (isNonRetryableError(error)) {
        console.log('Non-retryable error, failing immediately');
        throw error;
      }
      
      // Last attempt failed
      if (attempt === RETRY_CONFIG.maxRetries) {
        console.log('Max retries reached');
        break;
      }
      
      // Calculate delay with jitter
      const delay = Math.min(
        RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt),
        RETRY_CONFIG.maxDelay
      );
      const jitteredDelay = delay + Math.random() * 1000;
      
      console.log(`Retrying in ${jitteredDelay}ms...`);
      await new Promise(resolve => setTimeout(resolve, jitteredDelay));
    }
  }
  
  // This should never be null due to the loop logic, but TypeScript doesn't know that
  throw lastError || new Error('Unknown error during retry attempts');
}

// Rate limiting logic
async function isRateLimited(userId: string): Promise<boolean> {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 20; // Max 20 requests per minute per user
  
  const userLimits = rateLimitTracker.get(userId);
  
  if (!userLimits || now > userLimits.resetTime) {
    // Reset or initialize rate limit window
    rateLimitTracker.set(userId, {
      count: 1,
      resetTime: now + windowMs
    });
    return false;
  }
  
  if (userLimits.count >= maxRequests) {
    return true; // Rate limited
  }
  
  // Increment counter
  userLimits.count++;
  return false;
}

// Error classification
function isNonRetryableError(error: any): boolean {
  const errorCode = error?.code || error?.name || '';
  const errorMessage = error?.message || '';
  
  // Don't retry these errors
  const nonRetryableCodes = [
    'ValidationException',
    'AccessDeniedException', 
    'UnauthorizedException',
    'InvalidParameterException',
    'ContentPolicyViolation'
  ];
  
  // Don't retry quota exceeded (wait for reset instead)
  if (errorMessage.toLowerCase().includes('quota') || 
      errorMessage.toLowerCase().includes('limit exceeded')) {
    return true;
  }
  
  return nonRetryableCodes.some(code => errorCode.includes(code));
}

// Create error response in Amplify expected format
function createErrorResponse(message: string) {
  return {
    content: [{ text: message }],
    conversationId: '',
    associatedUserMessageId: '',
    stopReason: 'error' as const
  };
}

// Graceful error handling
function handleConversationError(error: any) {
  const errorType = classifyError(error);
  console.log(`Handling error type: ${errorType}`);
  
  switch (errorType) {
    case 'RATE_LIMIT':
      return createErrorResponse("I'm currently at capacity. Please try again in a moment.");
      
    case 'SERVICE_UNAVAILABLE':
      return createErrorResponse("I'm temporarily unavailable. Please try again shortly.");
      
    case 'CONTENT_POLICY':
      return createErrorResponse("I can't process that request. Please try rephrasing your question.");
      
    case 'QUOTA_EXCEEDED':
      return createErrorResponse("Service is temporarily at capacity. Please try again later.");
      
    default:
      return createErrorResponse("I encountered an error processing your request. Please try again.");
  }
}

function classifyError(error: any): string {
  const errorMessage = (error?.message || '').toLowerCase();
  const errorCode = error?.code || error?.name || '';
  
  if (errorCode.includes('Throttling') || errorMessage.includes('rate limit')) {
    return 'RATE_LIMIT';
  }
  
  if (errorCode.includes('ServiceUnavailable') || errorMessage.includes('service unavailable')) {
    return 'SERVICE_UNAVAILABLE';
  }
  
  if (errorMessage.includes('content policy') || errorMessage.includes('safety')) {
    return 'CONTENT_POLICY';
  }
  
  if (errorMessage.includes('quota') || errorMessage.includes('limit exceeded')) {
    return 'QUOTA_EXCEEDED';
  }
  
  return 'UNKNOWN';
}