import dotenv from "dotenv";
import app from "./app.js";
import { loadUsersFromFile } from "./data/user.js";

dotenv.config({
  path: "./.env",
});

app.listen(process.env.Port || 3000, async () => {
  await loadUsersFromFile();
  console.log(`Server is running on port ${process.env.Port || 3000}`);
});

app.on("error", (err) => {
  console.log("Error starting server:", err);
  process.exit(1);
});
