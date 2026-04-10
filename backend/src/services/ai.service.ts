import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Make sure this matches Railway!
});

export const parseJobDescription = async (description: string) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Extract job details: company, role, location, and salary from this text: "${description}". Return ONLY JSON.`,
        },
      ],
      model: "mixtral-8x7b-32768",
    });

    return JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
  } catch (error) {
    console.error("AI Parsing Error:", error);
    throw new Error("AI failed to parse description");
  }
};