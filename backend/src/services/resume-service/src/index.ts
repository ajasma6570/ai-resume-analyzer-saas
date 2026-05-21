import { logger } from "@/shared/logger";
import app from "./app";
import { connectDB } from "./config/db";
import { env } from "@resume/config/env";

const PORT = env.PORT;

connectDB()

app.listen(PORT, () => {
    logger.info(`Resume Service is running on port ${PORT}`)
});