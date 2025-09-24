import { AppDataSource } from "../config/database";
import { UserApifyCallHistorial } from "../entity/UserApifyCallHistorial";

export const UserApifyCallHistorialRepository =
  AppDataSource.getRepository(UserApifyCallHistorial);
