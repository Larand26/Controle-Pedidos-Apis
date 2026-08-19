import express from "express";
import cors from "cors";
import routes from "./routes.js";

import { verifyBearerToken } from "./middlewares/auth.middleware.js";

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
app.use(verifyBearerToken);

// Routes configuration
app.use("/api", routes);

export default app;
