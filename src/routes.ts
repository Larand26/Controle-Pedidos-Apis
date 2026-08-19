import { Router } from "express";
import type { Request, Response } from "express";

const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

export default routes;
