import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({
  path: "./.env",
});

app.listen(process.env.Port || 3000, () => {
  console.log(`Server is running on port ${process.env.Port || 3000}`);
});

app.on("error", (err) => {
  console.log("Error starting server:", err);
  process.exit(1);
});
