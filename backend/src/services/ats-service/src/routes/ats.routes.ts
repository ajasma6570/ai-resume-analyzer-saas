import express from "express";
import { analyzeResume, getUserAnalyses } from "@ats/controllers/ats.controller";
import { verifyAccessToken } from "@/shared/middleware/auth.middleware";

const router = express.Router();


// TEST
router.get("/ping", (req, res) =>
    res.json({
        message: "Ats service is running"
    }));

router.post("/analyze", verifyAccessToken, analyzeResume);
router.get("/history", verifyAccessToken, getUserAnalyses);

export default router;