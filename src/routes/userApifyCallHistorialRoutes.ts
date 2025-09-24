import { Router } from "express";
import { UserApifyCallHistorialController } from "../controller/UserApifyCallHistorialController";
import { authorize } from "../middlewares/authorize";

const router = Router();
const controller = new UserApifyCallHistorialController();



/**
 * @swagger
 * tags:
 *   name: CallHistorial
 *   description: Historial de llamadas/apify de los usuarios
 */

/**
 * @swagger
 * /historial:
 *   post:
 *     summary: Crear historial para un usuario (solo USER)
 *     tags: [CallHistorial]
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
 *       201:
 *         description: Historial creado
 */

// Crear historial → lo hace USER
router.post("/", authorize(["USER"]), (req, res) => controller.createHistorial(req, res));


/**
 * @swagger
 * /historial/{userId}:
 *   get:
 *     summary: Obtener historial de un usuario (ADMIN cualquiera, USER solo propio)
 *     tags: [CallHistorial]
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
 *         description: Historial encontrado
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Historial no encontrado
 */

// Obtener historial por userId → ADMIN puede ver cualquier, USER solo el suyo
router.get("/:userId", authorize(["ADMIN", "USER"]), (req, res) =>
  controller.getHistorialByUser(req, res)
);

/**
 * @swagger
 * /historial:
 *   get:
 *     summary: Obtener todos los historiales (solo ADMIN)
 *     tags: [CallHistorial]
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
 *         description: Lista de historiales
 */


// Obtener todos los historiales → solo ADMIN
router.get("/", authorize(["ADMIN"]), (req, res) => controller.getAllHistoriales(req, res));

export default router;
