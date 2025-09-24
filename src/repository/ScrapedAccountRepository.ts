// src/repository/ScrapedAccountRepository.ts
import { AppDataSource } from "../config/database";
import { ScrapedAccount } from "../entity/ScrapedAccount";

export const ScrapedAccountRepository = AppDataSource.getRepository(ScrapedAccount);
