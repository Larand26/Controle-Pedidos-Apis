import type { Request, Response, NextFunction } from "express";
// Importe o seu arquivo de configuração (ajuste o caminho conforme seu projeto)
import appConfig from "../config/app.config.js";

export const verifyBearerToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  // 1. Verifica se o header foi enviado
  if (!authHeader) {
    return res
      .status(401)
      .json({ erro: "Token de autorização não fornecido." });
  }

  // 2. Verifica se o formato é "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res
      .status(401)
      .json({ erro: "Formato de token inválido. Use 'Bearer <token>'." });
  }

  const token = parts[1];

  // 3. Compara com o token do seu appConfig
  if (token !== appConfig.api.secretToken) {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }

  // Se passou por tudo, o token é válido
  next();
};
