import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "@user/routes/user.routes";

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(cookieParser());

app.get("/ping", (req, res) => {
    res.json({
        message: "User pong!!"
    })
})

app.use("/", userRoutes);

export default app;