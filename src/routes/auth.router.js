import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import validateRequest from "../middlewares/validation.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";

const authRouter = express.Router();
const controller = new AuthController();

authRouter.post("/register", validateRequest(registerSchema), controller.register);
authRouter.post("/login", validateRequest(loginSchema), controller.login);

export default authRouter;
