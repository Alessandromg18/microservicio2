import { Router } from "express";
import { QuestionsController } from "../controller/QuestionsController";
import { authorize } from "../middlewares/authorize";

const router = Router();
const controller = new QuestionsController();


/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Operaciones de preguntas y respuestas
 */

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Crear una pregunta
 *     tags: [Questions]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: header
 *         name: x-user-role
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionDescription:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pregunta creada
 *       400:
 *         description: Error de validación
 */


// Usuario crea una pregunta (solo USER)
router.post("/", authorize(["USER"]), controller.createQuestion);


/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Obtener todas las preguntas
 *     tags: [Questions]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: header
 *         name: x-user-role
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Lista de preguntas
 */
// Obtener todas las preguntas (ADMIN ve todas, USER solo las suyas)
router.get("/", authorize(["ADMIN", "USER"]), controller.getAllQuestions);


/**
 * @swagger
 * /questions/{id}:
 *   get:
 *     summary: Obtener una pregunta por ID
 *     tags: [Questions]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: header
 *         name: x-user-role
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Pregunta encontrada
 *       404:
 *         description: Pregunta no encontrada
 */
// Obtener una pregunta por ID
router.get("/:id", authorize(["ADMIN", "USER"]), controller.getQuestionById);


/**
 * @swagger
 * /questions/status/{status}:
 *   get:
 *     summary: Obtener preguntas por estado (PENDING/ANSWERED)
 *     tags: [Questions]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: header
 *         name: x-user-role
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: status
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Lista filtrada de preguntas
 */
// Obtener preguntas por estado (PENDING o ANSWERED)
router.get("/status/:status", authorize(["ADMIN", "USER"]), controller.getQuestionsByStatus);


/**
 * @swagger
 * /questions/admin/{adminId}:
 *   get:
 *     summary: Obtener preguntas respondidas por un admin
 *     tags: [Questions]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: header
 *         name: x-user-role
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: adminId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Lista de preguntas respondidas
 */
// Obtener preguntas respondidas por un admin específico
router.get("/admin/:adminId", authorize(["ADMIN"]), controller.getQuestionsByAdmin);


/**
 * @swagger
 * /questions/user/{userId}:
 *   get:
 *     summary: Obtener preguntas de un usuario específico
 *     tags: [Questions]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: header
 *         name: x-user-role
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Lista de preguntas del usuario
 */
// Obtener preguntas de un usuario específico
router.get("/user/:userId", authorize(["USER","ADMIN"], { allowSameUser: true }), controller.getQuestionsByUserId);


/**
 * @swagger
 * /questions/reply:
 *   post:
 *     summary: Admin responde a una pregunta
 *     tags: [Questions]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: header
 *         name: x-user-role
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionId:
 *                 type: integer
 *               answerDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pregunta respondida
 */

// Admin responde una pregunta
router.post("/reply", authorize(["ADMIN"]), controller.replyQuestion);

export default router;
