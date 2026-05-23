import mongoose from "mongoose";
import { logger } from "@/shared/logger";
import { env } from "@resume/config/env";

export const connectDB = async () => {
    const mongoUri = env.MONGO_URI;

    if (!mongoUri) {
        logger.error("Resume Service MongoDB connection aborted: env.MONGO_URI is missing or empty.");
        process.exit(1);
    }

    mongoose.connection.on("error", (err) => {
        logger.error("Resume Service MongoDB runtime connection error:", { error: err });
    });

    mongoose.connection.on("disconnected", () => {
        logger.warn("Resume Service MongoDB disconnected!");
    });

    try {
        await mongoose.connect(mongoUri);
        logger.info("Resume Service MongoDB connected successfully");
    } catch (err) {
        logger.error("Resume Service MongoDB initial connection failed. Please verify your connection string and credentials.", { error: err });
        process.exit(1);
    }
};