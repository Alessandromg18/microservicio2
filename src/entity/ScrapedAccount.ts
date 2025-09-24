// src/entity/ScrapedAccount.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class ScrapedAccount {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  accountName!: string;

  @Column()
  userId!: number;

  @CreateDateColumn()
  scrapedAt!: Date;
}
