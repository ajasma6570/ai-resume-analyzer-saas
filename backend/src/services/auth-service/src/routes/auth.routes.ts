import express from "express";
import {
    verifyAccessToken,
} from "@/shared/middleware/auth.middleware";
import { login, logout, refreshTokenHandler, profile, register } from "@auth/controllers/auth.controller";
import { validate } from "@/shared/middleware/validate.middleware";
import { loginSchema, registerSchema } from "@auth/validations/auth.validation";

const router = express.Router();

router.get("/ping", (req, res) => {
    res.json({
        message: "Auth service is running"
    })
})

router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login);
router.get("/refresh-token", refreshTokenHandler);
router.get("/profile", verifyAccessToken, profile);
router.post("/logout", logout);

export default router;