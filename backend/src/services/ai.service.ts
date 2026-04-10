import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface ParsedJob {
  company: string;
  role: string;
  location: string;
  resumeSuggestions: string[];
}

export const parseJobDescription = async (jdText: string): Promise<ParsedJob> => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a career expert. Extract job details into JSON. 
          Keys: "company", "role", "location", "resumeSuggestions". 
          "resumeSuggestions" must be 3-5 tailored resume bullet points.
          Return ONLY the JSON object.`
        },
        { role: "user", content: jdText },
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch (error: any) {
    throw new Error("AI Analysis failed");
  }
};