import {
    Request,
    Response,
    NextFunction,
} from "express";

import { ZodSchema, ZodError } from "zod";

export const validate = (
    schema: ZodSchema
) => {

    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            schema.parse(req.body);

            next();

        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: error.issues[0]?.message || "Validation failed",
                    errors: error.issues,
                });
            }

            return res.status(500).json({
                message: "Internal server error during validation",
            });
        }
    };
};