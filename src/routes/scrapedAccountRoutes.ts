// src/routes/scrapedAccountRoutes.ts
import { Router } from "express";
import { ScrapedAccountController } from "../controller/ScrapedAccountController";
import { authorize } from "../middlewares/authorize";

const router = Router();
const controller = new ScrapedAccountController();



/**
 * @swagger
 * tags:
 *   name: ScrapedAccounts
 *   description: Endpoints para gestionar cuentas scrapeadas
 */

/**
 * @swagger
 * /scrapedAccounts:
 *   post:
 *     summary: Registrar una cuenta scrapeada
 *     tags: [ScrapedAccounts]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       description: Datos de la cuenta a registrar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountName:
 *                 type: string
 *                 description: Nombre de la cuenta scrapeada
 *             required:
 *               - accountName
 *     responses:
 *       201:
 *         description: Cuenta scrapeada registrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScrapedAccount'
 *       400:
 *         description: Error de validación
 */

// Registrar cuenta scrapeada → solo USER
router.post("/", authorize(["USER"]), controller.createAccount);



/**
 * @swagger
 * /scrapedAccounts:
 *   get:
 *     summary: Obtener todas las cuentas scrapeadas
 *     tags: [ScrapedAccounts]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las cuentas scrapeadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ScrapedAccount'
 */

// Obtener todas las cuentas scrapeadas → todos los roles
router.get("/", authorize(["USER","ADMIN"]), controller.getAllAccounts);



/**
 * @swagger
 * /scrapedAccounts/user/{userId}:
 *   get:
 *     summary: Obtener cuentas scrapeadas por un usuario específico
 *     tags: [ScrapedAccounts]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de cuentas scrapeadas por el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ScrapedAccount'
 *       404:
 *         description: No se encontraron cuentas scrapeadas para el usuario
 */
// Obtener cuentas scrapeadas por un usuario específico → todos los roles
router.get("/user/:userId", authorize(["USER","ADMIN"]), controller.getAccountsByUser);

export default router;
