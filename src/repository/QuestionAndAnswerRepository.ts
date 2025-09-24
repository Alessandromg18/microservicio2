import { AppDataSource } from "../config/database";
import { QuestAndAnswer } from "../entity/QuestAndAnswer";

export const QuestionAndAnswerRepository =
  AppDataSource.getRepository(QuestAndAnswer);
