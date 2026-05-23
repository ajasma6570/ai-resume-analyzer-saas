import express from "express";

import atsRoutes from "@ats/routes/ats.routes";

const app = express();

app.use(express.json());


app.use("/", atsRoutes);

export default app;