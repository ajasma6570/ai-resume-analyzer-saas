import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI =
    new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY!
    );

const model =
    genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
            responseMimeType: "application/json",
        },
    });

export const analyzeResumeWithGemini =
    async (
        resumeText: string,
        jobDescription: string
    ) => {

        const prompt = `

                            Analyze this resume against the job description and evaluate its overall quality. Perform the following checks:
                            1. Calculate a realistic ATS score (0 to 100) based on keyword matching and relevance.
                            2. Identify matched and missing skills relative to the job description.
                            3. Highlight general strengths and weaknesses of the resume.
                            4. Thoroughly check the resume for grammar, spelling, clarity, and formatting issues, and suggest specific corrections.

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

        const result =
            await model.generateContent(
                prompt
            );

        const response =
            result.response.text();

        return JSON.parse(response);
    };