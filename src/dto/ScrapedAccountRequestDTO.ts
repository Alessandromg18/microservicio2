// src/dto/ScrapedAccountRequestDTO.ts
import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class ScrapedAccountRequestDTO {
  @IsNotEmpty()
  @IsString()
  accountName!: string;

  @IsNotEmpty()
  @IsNumber()
  userId!: number;
}
