import { logger } from "@/shared/logger";
import app from "./app";
import { connectDB } from "./config/db";
import { env } from "@resume/config/env";

const PORT = env.PORT;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            logger.info(`Resume Service is running on port ${PORT}`);
        });
    } catch (err) {
        logger.error("Resume Service failed to start:", { error: err });
        process.exit(1);
    }
};

startServer();