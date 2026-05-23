import express from "express";
import cookieParser from "cookie-parser";

import userRoutes from "@user/routes/user.routes";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.get("/ping", (req, res) => {
    res.json({
        message: "User pong!!"
    })
})

app.use("/", userRoutes);

export default app;