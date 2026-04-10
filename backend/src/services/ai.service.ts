import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const parseJobWithAI = async (description: string) => {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Extract: company, role, location, salary. Text: "${description}". Return ONLY JSON: {"company":"", "role":"", "location":"", "salary":""}`
      }
    ],
    model: "mixtral-8x7b-32768",
    response_format: { type: "json_object" } // Forces Groq to send valid JSON
  });

  return JSON.parse(completion.choices[0]?.message?.content || "{}");
};