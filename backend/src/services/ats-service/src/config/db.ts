import mongoose from "mongoose";
import { logger } from "@/shared/logger";
import { env } from "@ats/config/env";

export const connectDB = async () => {
    const mongoUri = env.MONGO_URI;

    if (!mongoUri) {
        logger.error("ATS Service MongoDB connection aborted: env.MONGO_URI is missing or empty.");
        process.exit(1);
    }

    mongoose.connection.on("error", (err) => {
        logger.error("ATS Service MongoDB runtime connection error:", { error: err });
    });

    mongoose.connection.on("disconnected", () => {
        logger.warn("ATS Service MongoDB disconnected!");
    });

    try {
        await mongoose.connect(mongoUri);
        logger.info("ATS Service MongoDB connected successfully");
    } catch (err) {
        logger.error("ATS Service MongoDB initial connection failed. Please verify your connection string and credentials.", { error: err });
        process.exit(1);
    }
};