import { GoogleGenerativeAI } from "@google/generative-ai";

type Gemini = {
  prompt: string
}

export async function Gemini({prompt} : Gemini){
  const genAI = new GoogleGenerativeAI("AIzaSyCwSN3pd08kqsXvqeHm0d9FE99CXfPzqsw");

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);

  console.log(result.response)
  return result.response.text();
}
