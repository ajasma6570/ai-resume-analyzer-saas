import mongoose from "mongoose";
import { logger } from "@/shared/logger";
import { env } from "@ats/config/env";


export const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URI)

        logger.info("ATS service MongoDB connected successfully");

    } catch (err) {
        logger.error("ATS service MongoDB connection failed", { error: err });
        process.exit(1);
    }
}