// import { getRequestContext } from '@cloudflare/next-on-pages'

import OpenAI from "openai";

export const runtime = 'edge'

export async function POST(req: Request) {
    const { message } = await req.json() as { message: string }

  const responseText = 'Hello World'

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
              content: `tell me something about ${message} and ${responseText} in programming, in 20 words or less`,
          },
      ],
      store: false,
    });

  return new Response(`${completion.choices[0].message.content}`)
}
