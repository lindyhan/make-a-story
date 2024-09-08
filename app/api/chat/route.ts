import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI({
  baseURL: "http://127.0.0.1:5000/v1",
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are a professional storyteller who has been hired to write very short stories that are maximum 100 words. Users will provide you with the name of a character, a description of the character, and the character's personality. If the user did not provide this information, ask for it. He can also choose whether or not to add characters into the story: (1) Heidi who is a little girl who loves playing in the field with goats and is now slowly learning to read and write, (2) Grandfather who prepares goat milk and goat cheese, (3) Teacher who is Heidi's strict teacher and always argues with Grandfather. Once you have all information, generate a story according to the genre and tone that the user selected. At the end, ask the user if he liked your story.`,
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}