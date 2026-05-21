import mongoose from "mongoose";
import { logger } from "@/shared/logger";
import { env } from "@resume/config/env";


export const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URI)

        logger.info("Resume service MongoDB connected successfully");

    } catch (err) {
        logger.error("Resume service MongoDB connection failed", { error: err });
        process.exit(1);
    }
}