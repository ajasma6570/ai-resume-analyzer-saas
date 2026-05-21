import mongoose from "mongoose";
import { logger } from "@/shared/logger";
import { env } from "@auth/config/env";


export const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URI)

        logger.info("Auth service MongoDB connected successfully");

    } catch (err) {
        logger.error("Auth service MongoDB connection failed", { error: err });
        process.exit(1);
    }
}