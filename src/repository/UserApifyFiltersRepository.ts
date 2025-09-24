import { AppDataSource } from "../config/database";
import { UserApifyFilters } from "../entity/UserApifyFilters";

export const UserApifyFiltersRepository =
  AppDataSource.getRepository(UserApifyFilters);
