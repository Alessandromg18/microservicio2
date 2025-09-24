import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
import { StatusQA } from "./enums/StatusQA";

@Entity({ name: "quest_and_answer" })
export class QuestAndAnswer {
  @PrimaryGeneratedColumn()
  id!: number;

  // ID del usuario (viene de MS1 vía MS4)
  @Column({ name: "user_id", type: "int", nullable: false })
  userId!: number;

  // ID del admin (opcional, puede ser null si no está respondida aún)
  @Column({ name: "admin_id", type: "int", nullable: true })
  adminId?: number | null;

  @Column({
    type: "simple-enum", // <-- Cambiado aquí
    enum: StatusQA,
    default: StatusQA.PENDING,
  })
  status!: StatusQA;

  @Column({ type: "text", nullable: false })
  questionDescription!: string;

  @Column({ type: "date", nullable: false })
  questionDate!: string;

  @Column({ type: "time", nullable: false })
  questionHour!: string;

  @Column({ type: "text", nullable: true })
  answerDescription?: string;

  @Column({ type: "date", nullable: true })
  answerDate?: string;

  @Column({ type: "time", nullable: true })
  answerHour?: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
createdAt!: Date;

}

