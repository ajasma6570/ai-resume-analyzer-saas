import { logger } from "@/shared/logger";
import app from "./app";
import { env } from "@user/config/env"
import { connectDB } from "./config/db";

const PORT = env.PORT;

connectDB()

app.listen(PORT, () => {
    logger.info(`User Service is running on port ${PORT}`)
});