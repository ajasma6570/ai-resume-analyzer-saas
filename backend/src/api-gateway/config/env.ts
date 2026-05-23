import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT:
        process.env.PORT ||
        process.env.API_GATEWAY_PORT ||
        3000,

    NODE_ENV:
        process.env.NODE_ENV || "development",

    FRONTEND_URL:
        process.env.FRONTEND_URL || "http://localhost:5173",
};