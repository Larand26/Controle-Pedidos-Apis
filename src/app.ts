import express from "express";
import cors from "cors";
import routes from "./routes.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// Routes configuration
app.use("/api", routes);

export default app;
