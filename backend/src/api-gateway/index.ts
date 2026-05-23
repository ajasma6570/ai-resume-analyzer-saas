import express from "express";
import cors from "cors";

import { createProxyMiddleware }
    from "http-proxy-middleware";

import { logger }
    from "@/shared/logger";

import { env }
    from "./config/env";

import { SERVICES }
    from "@/shared/constants";

const app = express();

const PORT = env.PORT;

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            env.FRONTEND_URL
        ],
        credentials: true,
    })
);


// AUTH SERVICE
app.use(
    "/api/auth",

    createProxyMiddleware({
        target:
            SERVICES.AUTH ||
            "http://localhost:3001",

        changeOrigin: true,
    })
);


// USER SERVICE
app.use(
    "/api/user",

    createProxyMiddleware({
        target:
            SERVICES.USER ||
            "http://localhost:3002",

        changeOrigin: true,
    })
);


// RESUME SERVICE
app.use(
    "/api/resume",

    createProxyMiddleware({
        target:
            SERVICES.RESUME ||
            "http://localhost:3003",

        changeOrigin: true,
    })
);


// ATS SERVICE
app.use(
    "/api/ats",

    createProxyMiddleware({
        target:
            SERVICES.ATS ||
            "http://localhost:3004",

        changeOrigin: true,
    })
);

app.get("/ping", (req, res) => {
    res.json({
        message: "API Gateway Running"
    });
});


app.listen(PORT, () => {
    logger.info(
        `API Gateway running on ${PORT}`
    );
});