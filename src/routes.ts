import { Router } from "express";
import type { Request, Response } from "express";

import * as orderController from "./controllers/orderController.js";

const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

routes.post(
  "/orders/:orderId/change-status",
  orderController.changeOrderStatus,
);

export default routes;
