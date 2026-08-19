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

async function connectToDatabase(): Promise<sql.ConnectionPool> {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
    return pool;
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    throw error;
  }
}

async function disconnectFromDatabase(pool: sql.ConnectionPool): Promise<void> {
  try {
    await pool.close();
    console.log("Conexão com o banco de dados encerrada com sucesso.");
  } catch (error) {
    console.error("Erro ao desconectar do banco de dados:", error);
    throw error;
  }
}

export async function executeQuery(query: string): Promise<any> {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request().query(query);
    await disconnectFromDatabase(pool);
    return result.recordset;
  } catch (error) {
    console.error("Erro ao executar a consulta:", error);
    throw error;
  }
}
