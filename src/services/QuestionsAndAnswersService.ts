import { QuestionAndAnswerRepository } from "../repository/QuestionAndAnswerRepository";
import { QuestAndAnswer } from "../entity/QuestAndAnswer";
import { StatusQA } from "../entity/enums/StatusQA";
import { FullAnswerQuestionResponseDTO } from "../dto/FullAnswerQuestionResponseDTO";

export class QuestionsAndAnswersService {
  // Usuario crea una pregunta
  async assignQuestion(request: {
    userId: number;
    questionDescription: string;
  }): Promise<FullAnswerQuestionResponseDTO> {
    const now = new Date();

    const question = QuestionAndAnswerRepository.create({
      userId: request.userId,
      questionDescription: request.questionDescription,
      questionDate: now.toISOString().split("T")[0],
      questionHour: now.toTimeString().split(" ")[0],
      status: StatusQA.PENDING,
    });

    const saved = await QuestionAndAnswerRepository.save(question);
    return this.mapToDTO(saved);
  }

  // Obtener todas las preguntas
  async getQuestions(): Promise<FullAnswerQuestionResponseDTO[]> {
    const questions = await QuestionAndAnswerRepository.find();
    return questions.map((q) => this.mapToDTO(q));
  }

  // Obtener preguntas de un usuario específico
  async getQuestionsByUser(userId: number): Promise<FullAnswerQuestionResponseDTO[]> {
    const questions = await QuestionAndAnswerRepository.find({ where: { userId } });
    return questions.map((q) => this.mapToDTO(q));
  }

  // Obtener una pregunta por ID
  async getQuestionById(id: number): Promise<FullAnswerQuestionResponseDTO | null> {
    const question = await QuestionAndAnswerRepository.findOneBy({ id });
    return question ? this.mapToDTO(question) : null;
  }

  // Obtener preguntas respondidas por un admin
  async getQuestionsByAdmin(adminId: number): Promise<FullAnswerQuestionResponseDTO[]> {
    const questions = await QuestionAndAnswerRepository.find({ where: { adminId } });
    return questions.map((q) => this.mapToDTO(q));
  }

  // Obtener preguntas por estado (PENDING o ANSWERED)
  async getQuestionsByStatus(status: string): Promise<FullAnswerQuestionResponseDTO[]> {
  const normalized = status.toUpperCase() as keyof typeof StatusQA;

  if (!(normalized in StatusQA)) {
    throw new Error(`Estado inválido: ${status}. Usa PENDING o ANSWERED.`);
  }

  // 👇 conversión correcta: StatusQA[normalized] devuelve el valor del enum
  const questions = await QuestionAndAnswerRepository.find({ 
    where: { status: StatusQA[normalized] } 
  });

  if (questions.length === 0) {
    throw new Error(`No se encontraron preguntas con estado ${normalized}.`);
  }

  return questions.map((q) => this.mapToDTO(q));
}
  // Admin responde a una pregunta
  async replyQuestion(request: {
    adminId: number;
    questionId: number;
    answerDescription: string;
  }): Promise<FullAnswerQuestionResponseDTO> {
    const question = await QuestionAndAnswerRepository.findOneBy({
      id: request.questionId,
    });
    if (!question) throw new Error(`No question with ID ${request.questionId}`);

    if (question.status === StatusQA.ANSWERED) {
      throw new Error("This question has already been answered.");
    }

    const now = new Date();
    question.answerDescription = request.answerDescription;
    question.adminId = request.adminId;
    question.status = StatusQA.ANSWERED;
    question.answerDate = now.toISOString().split("T")[0];
    question.answerHour = now.toTimeString().split(" ")[0];

    const saved = await QuestionAndAnswerRepository.save(question);
    return this.mapToDTO(saved);
  }

  // Mapeo a DTO
  private mapToDTO(entity: QuestAndAnswer): FullAnswerQuestionResponseDTO {
    return {
      id: entity.id,
      status: entity.status,
      questionDescription: entity.questionDescription,
      answerDescription: entity.answerDescription,
      adminId: entity.adminId ?? undefined,
      userId: entity.userId,
      questionDate: entity.questionDate,
      questionHour: entity.questionHour,
      answerDate: entity.answerDate ?? undefined,
      answerHour: entity.answerHour ?? undefined,
    };
  }
}
