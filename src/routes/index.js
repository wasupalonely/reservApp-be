import express from "express";
import authRouter from "./auth.router.js";

const routerApi = (app) => {
    const router = express.Router();
    app.use("/api/v1", router);
    
    router.use("/auth", authRouter);
};

export default routerApi;