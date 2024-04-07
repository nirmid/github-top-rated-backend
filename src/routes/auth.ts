import express, { Router } from "express";
import { authController } from "../controllers/auth";

export const authRoutes = express.Router();

authRoutes.post("/login", authController.login);

authRoutes.put("/signup", authController.signup);
