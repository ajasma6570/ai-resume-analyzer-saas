import express from "express";
import cors from "cors";

import atsRoutes from "@ats/routes/ats.routes";

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);


app.use("/", atsRoutes);

export default app;