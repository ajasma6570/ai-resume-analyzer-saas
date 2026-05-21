import { Request, Response } from "express";
import mongoose from "mongoose";
import fs from "fs";

import { AuthRequest } from "@/shared/middleware/auth.middleware";

import {
    createResume,
    getUserResumesService,
    getResumeByIdService,
    deleteResumeService,
} from "@resume/services/resume.service";
import { extractPdfText } from "@/shared/utils/extractText";
import { formatResumeTitle } from "@/shared/utils/formatResumeTitle";

// UPLOAD RESUME
export const uploadResume =
    async (req: AuthRequest, res: Response) => {
        try {

            if (!req.file) {

                return res.status(400).json({
                    message:
                        "Resume file required",
                });
            }

            let extractedText = "";
            try {
                extractedText = await extractPdfText(req.file.path);
            } catch (err: any) {
                if (req.file.path) {
                    try {
                        fs.unlinkSync(req.file.path);
                    } catch (e) { }
                }
                throw err;
            }

            const formattedTitle = formatResumeTitle(req.file.originalname);

            const resume =
                await createResume({

                    userId:
                        req.user?.id as string,

                    title:
                        formattedTitle,

                    originalFileName:
                        req.file.originalname,

                    fileUrl:
                        req.file.path,

                    extractedText,
                });

            if (req.file.path) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (err) {
                    console.error("Failed to delete temp file:", err);
                }
            }

            return res.status(201).json({
                message:
                    "Resume uploaded successfully",

                resume,
            });

        } catch (error: any) {

            return res.status(500).json({
                message: error.message,
            });
        }
    };


// GET MY RESUMES
export const getMyResumes =
    async (
        req: AuthRequest,
        res: Response
    ) => {

        try {

            const resumes =
                await getUserResumesService(
                    req.user?.id as string
                );

            return res.json({
                resumes,
            });

        } catch (error: any) {

            return res.status(500).json({
                message: error.message,
            });
        }
    };


// GET RESUME BY ID
export const getResumeById =
    async (
        req: Request,
        res: Response
    ) => {

        try {
            const { id } = req.params;

            if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: "Invalid resume ID format",
                });
            }

            const resume =
                await getResumeByIdService(id);

            return res.json({
                resume,
            });

        } catch (error: any) {

            return res.status(500).json({
                message: error.message,
            });
        }
    };


// DELETE RESUME
export const deleteResume =
    async (
        req: Request,
        res: Response
    ) => {

        try {
            const { id } = req.params;

            if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: "Invalid resume ID format",
                });
            }

            await deleteResumeService(id);

            return res.json({
                message:
                    "Resume deleted successfully",
            });

        } catch (error: any) {

            return res.status(500).json({
                message: error.message,
            });
        }
    };