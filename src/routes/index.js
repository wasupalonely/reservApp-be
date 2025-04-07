import express from "express";
import authRouter from "./auth.router.js";
import userRouter from "./user.router.js";
import venueRouter from "./venue.router.js";

const routerApi = (app) => {
    const router = express.Router();
    app.use("/api/v1", router);
    
    router.use("/auth", authRouter);
    router.use("/users", userRouter);
    router.use("/venues", venueRouter);
};

export default routerApi;