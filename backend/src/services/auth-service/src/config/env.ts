import dotenv from "dotenv";

dotenv.config();

export const env = {

    PORT:
        process.env.AUTH_SERVICE_PORT || 3001,

    MONGO_URI:
        process.env.AUTH_MONGO_URI || "",

    ACCESS_TOKEN_SECRET:
        process.env.ACCESS_TOKEN_SECRET || "",

    REFRESH_TOKEN_SECRET:
        process.env.REFRESH_TOKEN_SECRET || "",

    ACCESS_TOKEN_EXPIRE:
        process.env.ACCESS_TOKEN_EXPIRE || "15m",

    REFRESH_TOKEN_EXPIRE:
        process.env.REFRESH_TOKEN_EXPIRE || "7d",

    NODE_ENV:
        process.env.NODE_ENV || "development",
};