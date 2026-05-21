import express from "express";
import { uploadResume, getMyResumes, getResumeById, deleteResume, } from "@resume/controllers/resume.controller";
import upload from "@/shared/middleware/upload.middleware";
import { verifyAccessToken } from "@/shared/middleware/auth.middleware";

const router = express.Router();


// TEST
router.get("/ping", (req, res) =>
    res.json({
        message: "Resume service is running"
    }));


// UPLOAD
router.post("/upload", verifyAccessToken, upload.single("resume"), uploadResume);

// MY RESUMES
router.get("/my-resumes", verifyAccessToken, getMyResumes);


// GET BY ID
router.get("/:id", verifyAccessToken, getResumeById);


// DELETE
router.delete("/:id", verifyAccessToken, deleteResume);

export default router;