// src/controller/ScrapedAccountController.ts
import { Request, Response } from "express";
import { ScrapedAccountService } from "../services/ScrapedAccountService";
import { ScrapedAccountRequestDTO } from "../dto/ScrapedAccountRequestDTO";
import { validate } from "class-validator";

export class ScrapedAccountController {
  private service = new ScrapedAccountService();

  createAccount = async (req: Request, res: Response) => {
    const user = (req as any).user;

    const dto = new ScrapedAccountRequestDTO();
    dto.accountName = req.body.accountName;
    dto.userId = user.id; // siempre asignamos el id del usuario que scrapeó

    const errors = await validate(dto);
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
      const account = await this.service.createAccount(dto);
      return res.status(201).json(account);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  };

  getAllAccounts = async (_: Request, res: Response) => {
    try {
      const accounts = await this.service.getAllAccounts();
      return res.json(accounts);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  };

  getAccountsByUser = async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    try {
      const accounts = await this.service.getAccountsByUser(userId);
      return res.json(accounts);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  };
}
