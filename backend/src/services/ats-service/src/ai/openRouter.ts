import OpenAI from "openai";

import dotenv from "dotenv";

dotenv.config();



const client = new OpenAI({

    apiKey:
        process.env.OPENROUTER_API_KEY,

    baseURL:
        "https://openrouter.ai/api/v1",
});



export const analyzeResumeWithAI =
    async (

        resumeText: string,

        jobDescription: string

    ) => {

        const prompt = `

        Analyze this resume against the job description.

        Return ONLY valid JSON.

        {
          "atsScore": number,
          "matchedSkills": [],
          "missingSkills": [],
          "strengths": [],
          "weaknesses": [],
          "suggestions": [],
          "aiFeedback": ""
        }

        Resume:
        ${resumeText}

        Job Description:
        ${jobDescription}
    `;



        const response =
            await client.chat.completions.create({

                model:
                    "deepseek/deepseek-chat",

                messages: [

                    {
                        role: "system",

                        content:
                            "You are an ATS resume analyzer AI.",
                    },

                    {
                        role: "user",

                        content: prompt,
                    },
                ],

                response_format: {
                    type: "json_object",
                },

                temperature: 0.3,
            });



        const content =
            response.choices[0]
                .message.content;

        if (!content) {

            throw new Error(
                "No response generated"
            );
        }

        return JSON.parse(content);
    };