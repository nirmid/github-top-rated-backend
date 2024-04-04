import express, { Router } from "express";
import { authController } from "../controllers/auth";

export const authRoutes = express.Router();

/**
 * @openapi
 * /healthcheck:
 *  get:
 *     tags:
 *     - Healthcheck
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
authRoutes.post("/login", authController.login);

/**
 * @openapi
 * /auth/signup:
 * put:
 * summary: Signup
 * description: Signup
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * username:
 * type: string
 * password:
 * type: string
 * required:
 * - username
 * - password
 * responses:
 * 201:
 * description: Created
 *
 *
 **/
authRoutes.put("/signup", authController.signup);
