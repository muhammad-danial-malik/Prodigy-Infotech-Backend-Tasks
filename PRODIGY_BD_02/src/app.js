import express from "express";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Import routes
import userRouter from "./routes/user.routes.js";

// routes Decelaration
app.use("/api/v1/users", userRouter);

export default app;