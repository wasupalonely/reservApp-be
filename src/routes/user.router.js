import express from "express";
import authenticate from "../middlewares/auth.middleware.js";
import { UserController } from "../controllers/user.controller.js";
import validateRequest from "../middlewares/validation.middleware.js";
import { userPaginationSchema } from "../schemas/user.schema.js";

const userRouter = express.Router();
const controller = new UserController();

userRouter.get(
  "/",
  authenticate(["SUPERADMIN"]),
  validateRequest(userPaginationSchema),
  controller.getAllUsers
);

userRouter.get(
  "/profile",
  authenticate(["USER", "VENUE_ADMIN", "SUPERADMIN"]),
  controller.profile
);
userRouter.patch(
  "/profile",
  authenticate(["USER", "VENUE_ADMIN", "SUPERADMIN"]),
  controller.updateProfile
);

export default userRouter;
