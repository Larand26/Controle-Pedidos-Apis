import type { Request, Response, NextFunction } from "express";
import { z, ZodError, type ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          erro: "Requisição inválida",
          detalhes: error.issues.map((issue) => ({
            campo: issue.path.join("."),
            mensagem: issue.message,
          })),
        });
      }
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  };
};
