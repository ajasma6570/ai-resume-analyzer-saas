import express from "express";

import resumeRoutes from "@resume/routes/resume.routes";

const app = express();

app.use(express.json());

app.use(
    "/uploads",

    express.static(
        "src/services/resume-service/src/uploads"
    )
);


app.use("/", resumeRoutes);

export default app;