import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getProfile,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/authorizeRole.middleware.js";

const router = Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.post("/logout", verifyJWT, logoutUser);
router.get("/profile", verifyJWT, getProfile);
router.get("/", verifyJWT, authorizeRoles("admin"), getAllUsers);

export default router;
