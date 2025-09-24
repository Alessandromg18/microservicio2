// src/services/ScrapedAccountService.ts
import { ScrapedAccountRepository } from "../repository/ScrapedAccountRepository";
import { ScrapedAccount } from "../entity/ScrapedAccount";
import { ScrapedAccountRequestDTO } from "../dto/ScrapedAccountRequestDTO";

export class ScrapedAccountService {
  async createAccount(dto: ScrapedAccountRequestDTO): Promise<ScrapedAccount> {
    const newAccount = ScrapedAccountRepository.create({
      accountName: dto.accountName,
      userId: dto.userId,
    });
    return await ScrapedAccountRepository.save(newAccount);
  }

  async getAllAccounts(): Promise<ScrapedAccount[]> {
    return await ScrapedAccountRepository.find();
  }

  async getAccountsByUser(userId: number): Promise<ScrapedAccount[]> {
    return await ScrapedAccountRepository.find({ where: { userId } });
  }
}
