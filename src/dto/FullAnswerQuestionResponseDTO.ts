import { StatusQA } from "../entity/enums/StatusQA";

export class FullAnswerQuestionResponseDTO {
  id!: number;
  status!: StatusQA;
  questionDescription!: string;

  // Datos de la pregunta
  questionDate!: string;
  questionHour!: string;

  // Relación con usuarios/admins (solo IDs, no entidades)
  userId!: number;
  adminId?: number;

  // Datos de la respuesta (opcionales, porque pueden ser null hasta que se responda)
  answerDescription?: string;
  answerDate?: string;
  answerHour?: string;
}
