import { Router } from "express";
import type { Request, Response } from "express";

import * as orderController from "./controllers/orderController.js";

// middlewares
import { validateRequest } from "./middlewares/validateRequest.middleware.js";
import { updateOrderStatusSchema } from "./schemas/order.schema.js";

const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

routes.post(
  "/orders/:orderId/change-status",
  validateRequest(updateOrderStatusSchema),
  orderController.changeOrderStatus,
);

routes.get("/orders/status", orderController.getOrderStatus);

export default routes;
