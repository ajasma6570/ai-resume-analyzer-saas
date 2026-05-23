import { logger } from "@/shared/logger";
import app from "./app";
import { env } from "@user/config/env"
import { connectDB } from "./config/db";

const PORT = env.PORT;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            logger.info(`User Service is running on port ${PORT}`);
        });
    } catch (err) {
        logger.error("User Service failed to start:", { error: err });
        process.exit(1);
    }
};

startServer();