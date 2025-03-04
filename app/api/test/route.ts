// import { getRequestContext } from '@cloudflare/next-on-pages'
import { drinks, mainCourses, starters } from "@/lib/data";
import OpenAI from "openai";

export const runtime = 'edge'

export async function POST(req: Request) {
    const { message } = await req.json() as { message: string }

  // Prepare menu data
  const startersList = starters
  .map(
    (item) =>
      `ID: ${item.id}. Name: ${item.name}. Ingredients: ${item.ingredients}. Allergens: ${item.allergens} `
  )
  .join(", ");
const mainCoursesList = mainCourses
  .map(
    (item) =>
      `ID: ${item.id}. Name: ${item.name}. Ingredients: ${item.ingredients}. Allergens: ${item.allergens}`
  )
  .join(", ");
const drinksList = drinks
  .map(
    (item) =>
      `ID: ${item.id}. Name: ${item.name}. Ingredients: ${item.ingredients}. Allergens: ${item.allergens}`
  )
  .join(", ");

// Create the system prompt
const systemPrompt = `Your traits include expert knowledge, helpfulness, cleverness, and articulateness.
  You are a well-behaved and well-mannered individual.
  You is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
  You will not invent anything that is not drawn directly from the context.
  
  START CONTEXT BLOCK
  AI assistant is a big fan of Viet80s Restaurant, a famous Vietnamese Restaurant in Nottingham, UK.
  AI assistant is very familiar with the menu of Viet80s Restaurant below and it will read through it again to have a good answer.
  Menu of Viet80s Restaurant:
 Starters: ${startersList}
  Main courses: ${mainCoursesList}
  Drinks: ${drinksList}
  END OF CONTEXT BLOCK

  AI assistant will try to answer only one question based on the CONTEXT BLOCK provided:
  Based on the menu, as well as the questions and the customer's answers here: ${message}. 
  What would you recommend for a customer of Viet80s Restaurant? 
  Give maximum 8 options (3 for main courses, 3 for starters, and 2 for drinks). The options have to be in the menu provided in the context block.
  Give a convincing and good reasons for your recommendations customised based on the customer's answers. Try to make the recommendations as relevant as possible to the customer's answers, and then explain the relevance and the reasons for your recommendations. 
  Use maximum 250 words for your response.
  In your answer, for each recommended dish, make their name clickable text with a link to https://www.viet80sonline.co.uk/?item=<Item_ID>. 
  For example, if you recommend "Vegan Salad", you should make "Vegan Salad" clickable text with a link <a href="https://www.viet80sonline.co.uk/?item=1" style="color:red;text-decoration: underline;" target="_blank">Vegan Salad</a>.`;

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
              content: systemPrompt,
          },
      ],
      store: false,
    });

  return new Response(`${completion.choices[0].message.content}`)
}
