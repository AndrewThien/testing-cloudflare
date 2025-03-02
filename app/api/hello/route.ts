import { NextResponse } from "next/server";
import { getRequestContext } from '@cloudflare/next-on-pages'
import OpenAI from "openai";

export const runtime = 'edge'

export async function POST() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API key is not available.");
    }

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
              role: "user",
              content: "Write a haiku about recursion in programming.",
          },
      ],
      store: true,
    });
  
    console.log(completion.choices[0].message);
    // Use native fetch API instead of OpenAI SDK (which might not be Edge-compatible)
    // const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    //     "HTTP-Referer": "https://viet80s.co.uk/",
    //     "X-Title": "Viet80s",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     model: "meta-llama/llama-3.3-70b-instruct:free",
    //     messages: [
    //       {
    //         role: "user",
    //         content: "what is the meaning of life?",
    //       },
    //     ],
    //   }),
    // });

    // if (!response.ok) {
    //   throw new Error(`OpenRouter API responded with status: ${response.status}`);
    // }
    
    // const result: any = await response.json();
    return NextResponse.json({ content: completion.choices[0].message.content });
    
  } catch (error: any) {
    console.error("AI API error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}