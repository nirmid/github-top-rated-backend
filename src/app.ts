import express, { Express, Request, Response, NextFunction } from "express";
import { userRoutes } from "./routes/user";
import { authRoutes } from "./routes/auth";
import { CustomError } from "./classes/custom_error";
import dotenv from "dotenv";
import { sequelize } from "./util/database";
import "./models/assosiaction";
import { authController } from "./controllers/auth";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.use("/user", authController.authenticateToken, userRoutes);

// main error handling middleware
app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const status: number = error.statusCode || 500;
    return res.status(status).json({ message: error.message });
  }
);

//docs
const swaggerDocument = YAML.load("./src/util/openapi.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// server
const port: string = process.env.APP_PORT || "4000";

sequelize
  .sync({ force: true })
  .then(() => {
    app.listen(port);
    console.log("Server is running on port: " + port);
  })
  .catch((error: Error) => {
    console.log(error);
  });
