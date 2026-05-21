import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface UserPayload {
    id: string;
    email: string;
}

export interface AuthRequest extends Request {
    user?: UserPayload;
}

export const verifyAccessToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "No token provided"
            })
        }

        const token = authHeader.split(" ")[1]

        if (!token) {
            return res.status(401).json({
                message: "Invalid Token"
            })
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as string
        ) as UserPayload;

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(403).json({
            message: "Token expired or invalid"
        })
    }
}
