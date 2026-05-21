import { z } from "zod";

export const updateProfileSchema =
    z.object({

        name: z
            .string()
            .min(3)
            .optional(),

        avatar: z
            .string()
            .optional(),

        subscription: z
            .enum([
                "free",
                "premium"
            ])
            .optional(),
    });