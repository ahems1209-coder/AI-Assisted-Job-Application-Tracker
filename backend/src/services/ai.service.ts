import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const parseJobWithAI = async (description: string) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Extract the company name, job role, location, and salary from this text: "${description}". 
          Return ONLY a JSON object in this format: {"company": "", "role": "", "location": "", "salary": ""}`
        }
      ],
      model: "mixtral-8x7b-32768",
      response_format: { type: "json_object" } 
    });

    return JSON.parse(completion.choices[0]?.message?.content || "{}");
  } catch (error) {
    console.error("Groq Error:", error);
    throw new Error("AI failed to parse description");
  }
};