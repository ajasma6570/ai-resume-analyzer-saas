import mongoose from "mongoose";
import { logger } from "@/shared/logger";
import { env } from "@user/config/env";


export const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URI)

        logger.info("User service MongoDB connected successfully");

    } catch (err) {
        logger.error("User service MongoDB connection failed", { error: err });
        process.exit(1);
    }
}