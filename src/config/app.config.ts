import dotenv from "dotenv";
dotenv.config();

const appConfig = {
  api: {
    port: process.env.PORT || 3001,
  },
  db: {
    host: process.env.SQLSERVER_HOST || "localhost",
    port: Number(process.env.SQLSERVER_PORT) || 1433,
    user: process.env.SQLSERVER_USER || "seu usuario",
    password: process.env.SQLSERVER_PASSWORD || "sua senha",
    database: process.env.SQLSERVER_DATABASE || "sua base de dados",
  },
};
export default appConfig;
