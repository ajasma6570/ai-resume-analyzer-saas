import dotenv from "dotenv";

dotenv.config();

export const env = {

    PORT:
        process.env.RESUME_SERVICE_PORT || 3003,

    MONGO_URI:
        process.env.RESUME_MONGO_URI || "",

    NODE_ENV:
        process.env.NODE_ENV || "development",
};