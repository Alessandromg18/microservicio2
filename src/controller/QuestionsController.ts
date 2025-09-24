import { Request, Response } from "express";
import { QuestionsAndAnswersService } from "../services/QuestionsAndAnswersService";

export class QuestionsController {
  private service: QuestionsAndAnswersService;

  constructor() {
    this.service = new QuestionsAndAnswersService();
  }

  // Usuario crea una pregunta
  createQuestion = async (req: Request, res: Response) => {
    const user = (req as any).user; // viene del middleware authorize
    const { questionDescription } = req.body;

    if (!user?.id || !questionDescription) {
      return res.status(400).json({ error: "questionDescription es obligatorio" });
    }

    try {
      const question = await this.service.assignQuestion({
        userId: Number(user.id),
        questionDescription,
      });
      return res.status(201).json(question);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  // Obtener todas las preguntas (USER solo las suyas, ADMIN todas)
  getAllQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await this.service.getQuestions(); // siempre todas
    return res.json(questions);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
};

  // Obtener una pregunta por ID (solo propia si es USER)
  // Obtener una pregunta por ID (foro público)
getQuestionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const question = await this.service.getQuestionById(Number(id));

    if (!question) {
      return res.status(404).json({ error: "Pregunta no encontrada" });
    }

    return res.json(question);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

  // Obtener todas las preguntas respondidas por un admin
  getQuestionsByAdmin = async (req: Request, res: Response) => {
    const { adminId } = req.params;

    try {
      const questions = await this.service.getQuestionsByAdmin(Number(adminId));
      return res.json(questions);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  // Obtener todas las preguntas por estado
  getQuestionsByStatus = async (req: Request, res: Response) => {
    const { status } = req.params;

    try {
      const questions = await this.service.getQuestionsByStatus(status);
      return res.json(questions);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  // Admin responde a una pregunta
  replyQuestion = async (req: Request, res: Response) => {
    const admin = (req as any).user;
    const { questionId, answerDescription } = req.body;

    if (!admin?.id || !questionId || !answerDescription) {
      return res.status(400).json({
        error: "questionId y answerDescription son obligatorios",
      });
    }

    try {
      const answered = await this.service.replyQuestion({
        adminId: Number(admin.id),
        questionId,
        answerDescription,
      });
      return res.json(answered);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  // Obtener todas las preguntas de un usuario específico
getQuestionsByUserId = async (req: Request, res: Response) => {
  const requester = (req as any).user; // viene del middleware authorize
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "Se requiere userId" });
  }

  try {
    // Validación: si es USER solo puede ver sus propias preguntas
    if (requester.role !== "ADMIN" && Number(userId) !== requester.id) {
      return res.status(403).json({ error: "Acceso denegado: solo el propietario o admin" });
    }

    const questions = await this.service.getQuestionsByUser(Number(userId));
    return res.json(questions);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};


}
