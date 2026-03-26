// /lib/vapi.sdk.ts
import Vapi from "@vapi-ai/web";

// Get API key from environment variables
const apiKey = process.env.NEXT_PUBLIC_VAPI_KEY;

if (!apiKey) {
  console.error("❌ Missing VAPI API key — set NEXT_PUBLIC_VAPI_KEY in your .env.local");
}

// Create Vapi instance (browser SDK)
export const vapi = new Vapi(apiKey!);
