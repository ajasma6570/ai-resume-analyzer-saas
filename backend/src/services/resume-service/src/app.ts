import express from "express";
import path from "path";
import resumeRoutes from "@resume/routes/resume.routes";

const app = express();

app.use(express.json());

app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "uploads"))
);


app.use("/", resumeRoutes);

export default app;