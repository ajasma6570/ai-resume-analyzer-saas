import dotenv from "dotenv";

dotenv.config();

export const env = {

    PORT:
        process.env.USER_SERVICE_PORT || 3002,
    MONGO_URI:
        process.env.AUTH_MONGO_URI || "",
    NODE_ENV:
        process.env.NODE_ENV || "development",
};