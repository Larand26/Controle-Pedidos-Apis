import sql from "mssql";
import appConfig from "../config/app.config.js";

const dbConfig = {
  server: appConfig.db.host,
  port: appConfig.db.port,
  user: appConfig.db.user,
  password: appConfig.db.password,
  database: appConfig.db.database,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export async function connectToDatabase(): Promise<sql.ConnectionPool> {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
    return pool;
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    throw error;
  }
}
