import express from "express";
import cors from "cors";

import resumeRoutes from "@resume/routes/resume.routes";

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(
    "/uploads",

    express.static(
        "src/services/resume-service/src/uploads"
    )
);


app.use("/", resumeRoutes);

export default app;