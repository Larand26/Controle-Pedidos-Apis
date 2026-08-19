import type { Request, Response } from "express";

import { changeOrderStatus as changeOrderStatusService } from "../services/orderService.js";

export async function changeOrderStatus(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const { newStatusID } = req.body;

    res
      .status(200)
      .json(
        await changeOrderStatusService(Number(orderId), Number(newStatusID)),
      );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao alterar o status do pedido", error });
  }
}
