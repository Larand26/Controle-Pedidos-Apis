import sql from "mssql";
import appConfig from "../config/app.config.js";
import logger from "../utils/logger.js";

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

async function connectToDatabase(): Promise<sql.ConnectionPool> {
  try {
    const pool = await sql.connect(dbConfig);
    logger.success("Conexão com o banco de dados estabelecida com sucesso.");
    return pool;
  } catch (error) {
    logger.error("Erro ao conectar ao banco de dados:");
    throw error;
  }
}

async function disconnectFromDatabase(pool: sql.ConnectionPool): Promise<void> {
  try {
    await pool.close();
    logger.success("Conexão com o banco de dados encerrada com sucesso.");
  } catch (error) {
    logger.error("Erro ao desconectar do banco de dados:");
    throw error;
  }
}

export async function executeQuery(query: string): Promise<any> {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request().query(query);
    await disconnectFromDatabase(pool);
    logger.success("Consulta executada com sucesso.");
    return result.recordset;
  } catch (error) {
    console.error("Erro ao executar a consulta:", error);
    throw error;
  }
}
