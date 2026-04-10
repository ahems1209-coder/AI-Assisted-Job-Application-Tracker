import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, 
});

export const parseJobWithAI = async (description: string) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Extract: company, role, location, salary. Text: "${description}". Return JSON only. Format: {"company": "", "role": "", "location": "", "salary": ""}`,
        },
      ],
      model: "mixtral-8x7b-32768",
    });

    const content = completion.choices[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch (error) {
    console.error("Groq SDK Error:", error);
    throw new Error("AI Parsing failed");
  }
};