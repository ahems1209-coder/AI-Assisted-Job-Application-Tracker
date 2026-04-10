import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const parseJobWithAI = async (description: string) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Extract: company name, job role. Text: "${description}". Return ONLY JSON: {"company": "", "role": ""}`
        }
      ],
      model: "mixtral-8x7b-32768",
      response_format: { type: "json_object" } 
    });

    return JSON.parse(completion.choices[0]?.message?.content || "{}");
  } catch (error) {
    console.error("Groq AI Error:", error);
    throw new Error("AI failed to parse");
  }
};