import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "@/shared/middleware/auth.middleware";
import { generateAccessToken, generateRefreshToken } from "@auth/utils/jwt";
import { loginUser, registerUser } from "@auth/services/auth.service";
import { logger } from "@/shared/logger";
import { env } from "@auth/config/env"

export const register = async (
    req: Request,
    res: Response
) => {

    try {
        const { name, email, password, } = req.body;
        const user = await registerUser(name, email, password);

        logger.info("User registered successfully", {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

        return res.status(201).json({
            message: "User registered successfully",
            user,
        });

    } catch (error: any) {
        logger.error("Error registering user", error);
        return res.status(400).json({
            message: error.message,
        });
    }
};



export const login = async (
    req: Request,
    res: Response
) => {

    try {

        const { email, password } = req.body;

        const user = await loginUser(email, password);

        const payload = {
            id: user._id,
            email: user.email,
        };

        const accessToken = generateAccessToken(payload);

        const refreshToken = generateRefreshToken(payload);

        user.refreshToken = refreshToken;

        user.lastLogin = new Date();

        await user.save();

        res.cookie(
            "refreshToken",
            refreshToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
            }
        );

        logger.info("User logged in successfully", {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

        return res.json({
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error: any) {
        logger.error("Error logging in user", error);
        return res.status(401).json({
            message: error.message,
        });
    }
};




export const refreshTokenHandler =
    async (
        req: Request,
        res: Response
    ) => {

        try {
            const refreshToken =
                req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({
                    message: "Refresh token missing",
                });
            }

            const decoded: any =
                jwt.verify(
                    refreshToken,
                    env.REFRESH_TOKEN_SECRET
                );

            const accessToken =
                generateAccessToken({
                    id: decoded.id,
                    email: decoded.email,
                });

            logger.info("Refresh token generated successfully", {
                user: {
                    id: decoded.id,
                    email: decoded.email,
                }
            });

            return res.json({
                accessToken,
            });



        } catch (error: any) {
            logger.error("Error generating refresh token", error);
            return res.status(403).json({
                message: "Invalid refresh token",
            });
        }
    };




export const profile = (
    req: AuthRequest,
    res: Response
) => {

    logger.info("Profile accessed successfully", {
        user: req.user,
    });

    return res.json({
        user: req.user,
    });
};




export const logout = (
    req: Request,
    res: Response
) => {

    res.clearCookie("refreshToken");

    logger.info("User logged out successfully");

    return res.json({
        message: "Logged out successfully",
    });
};