import "reflect-metadata";
import { DataSource } from "typeorm";
import { QuestAndAnswer } from "../entity/QuestAndAnswer";
import { UserApifyFilters } from "../entity/UserApifyFilters";
import { UserApifyCallHistorial } from "../entity/UserApifyCallHistorial";
import { ScrapedAccount } from "../entity/ScrapedAccount";

const DB_HOST = process.env.DB_HOST;
if (!DB_HOST) {
  console.error("❌ DB_HOST no definido. Setea la variable DB_HOST con la IP de la MV BD.");
  process.exit(1);
}

export const AppDataSource = new DataSource({
  type: "mysql",
  host: DB_HOST, // viene del docker-compose
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "utec",
  database: process.env.DB_NAME ?? "qa_db",
  synchronize: true,
  logging: false,
  entities: [
    QuestAndAnswer,
    UserApifyFilters,
    UserApifyCallHistorial,
    ScrapedAccount,
  ],
});

export const initDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Conexión a MySQL establecida correctamente");
  } catch (error) {
    console.error("❌ Error al conectar a MySQL:", error);
    process.exit(1);
  }
};
