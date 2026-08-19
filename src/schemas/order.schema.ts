import { z } from "zod";

export const updateOrderStatusSchema = z.object({
  params: z.object({
    orderId: z.coerce.number({
      message: "O orderId na URL é obrigatório e deve ser um número válido.",
    }),
  }),
  body: z.object({
    newStatusID: z.number({
      message: "O campo newStatusID é obrigatório no corpo da requisição.",
    }),
  }),
});
