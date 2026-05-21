import dotenv from "dotenv";

dotenv.config();

export const env = {

    PORT:
        process.env.ATS_SERVICE_PORT || 3004,

    MONGO_URI:
        process.env.ATS_MONGO_URI || "",

    NODE_ENV:
        process.env.NODE_ENV || "development",
};