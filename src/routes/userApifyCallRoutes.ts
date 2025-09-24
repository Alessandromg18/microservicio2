import { Router } from "express";
import { UserApifyCallController } from "../controller/UserApifyCallController";
import { authorize } from "../middlewares/authorize";

const router = Router();
const controller = new UserApifyCallController();


/**
 * @swagger
 * tags:
 *   name: UserFilters
 *   description: Operaciones sobre filtros de usuario
 */

/**
 * @swagger
 * /filters:
 *   post:
 *     summary: Crear un filtro (solo USER)
 *     tags: [UserFilters]
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
 *               filterName:
 *                 type: string
 *               filterConfig:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Filtro creado
 */
// Crear un filtro → lo hace USER
router.post("/", authorize(["USER"]), controller.createFilter);



/**
 * @swagger
 * /filters:
 *   get:
 *     summary: Obtener todos los filtros (solo ADMIN)
 *     tags: [UserFilters]
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
 *         description: Lista de filtros
 */

// Obtener todos los filtros → solo ADMIN
router.get("/", authorize(["ADMIN"]), controller.getAllFilters);




/**
 * @swagger
 * /filters/{id}:
 *   get:
 *     summary: Obtener filtro por ID (USER solo los suyos, ADMIN todos)
 *     tags: [UserFilters]
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
 *         description: Filtro encontrado
 *       404:
 *         description: Filtro no encontrado
 */
// Obtener filtro por ID → ADMIN puede ver todos, USER solo los suyos
router.get("/:id", authorize(["ADMIN", "USER"]), controller.getFilterById);


export default router;
