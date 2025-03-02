// app/api/ai/route.ts
import { NextResponse } from "next/server";
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

// Specify Edge runtime


export async function POST() {
  try {
   
    // Use native fetch API instead of OpenAI SDK (which might not be Edge-compatible)
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://viet80s.co.uk/",
        "X-Title": "Viet80s",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [
          {
            role: "user",
            content: "what is the meaning of life?",
          },
        ],
      }),
    });
    
    if (!response.ok) {
      throw new Error(`OpenRouter API responded with status: ${response.status}`);
    }
    
    const result: any = await response.json();
    return NextResponse.json({ content: result.choices[0].message.content });
    
  } catch (error: any) {
    console.error("AI API error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}