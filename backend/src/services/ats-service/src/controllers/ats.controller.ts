import { Response } from "express";
import { AuthRequest } from "@/shared/middleware/auth.middleware";

import { analyzeResumeWithAI } from "../ai/openRouter";
import { createATSAnalysis, getUserAnalysesService } from "../services/ats.service";

export const analyzeResume =
    async (
        req: AuthRequest,
        res: Response
    ) => {

        try {
            if (!req.user) {
                return res.status(401).json({
                    message: "Unauthorized: User not found in request",
                });
            }

            const {
                resumeId,
                resumeText,
                jobDescription,
            } = req.body;

            const aiAnalysis =
                await analyzeResumeWithAI(
                    resumeText,
                    jobDescription
                );

            const analysis =
                await createATSAnalysis({

                    userId:
                        req.user.id,

                    resumeId,

                    atsScore:
                        aiAnalysis.atsScore,

                    matchedSkills:
                        aiAnalysis.matchedSkills,

                    missingSkills:
                        aiAnalysis.missingSkills,

                    strengths:
                        aiAnalysis.strengths,

                    weaknesses:
                        aiAnalysis.weaknesses,

                    suggestions:
                        aiAnalysis.suggestions,

                    aiFeedback:
                        aiAnalysis.aiFeedback,

                    analyzedText:
                        resumeText,

                    jobDescription,
                });

            return res.json({

                message:
                    "Resume analyzed successfully",

                analysis,
            });

        } catch (error: any) {

            return res.status(500).json({
                message: error.message,
            });
        }
    };

export const getUserAnalyses =
    async (
        req: AuthRequest,
        res: Response
    ) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: "Unauthorized: User not found in request",
                });
            }

            const analyses = await getUserAnalysesService(req.user.id);

            return res.json({
                analyses,
            });

        } catch (error: any) {
            return res.status(500).json({
                message: error.message,
            });
        }
    };