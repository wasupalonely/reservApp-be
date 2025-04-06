import express from "express";
import dotenv from "dotenv";
import boom from "@hapi/boom";
import errorHandler from "./middlewares/error.middleware.js";
import routerApi from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Test route
app.get("/ping", (req, res) => {
    res.send("pong");
});

routerApi(app);

app.all(/(.*)/, (req, res, next) => {
    next(boom.notFound(`Ruta ${req.originalUrl} no existe`, {
      method: req.method,
      attemptedUrl: req.originalUrl
    }));
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`API is listening on port ${PORT}`);
});