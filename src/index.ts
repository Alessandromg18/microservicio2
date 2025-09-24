import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { initDatabase } from "./config/database";

// Rutas
import questionsRoutes from "./routes/questionsRoutes";
import userApifyCallHistorialRoutes from "./routes/userApifyCallHistorialRoutes";
import userApifyCallRoutes from "./routes/userApifyCallRoutes";
import scrapedAccountRoutes from "./routes/scrapedAccountRoutes";

// Swagger
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());

// Configuración Swagger

const port = Number(process.env.PORT ?? 8005);
// 👇 Usa la IP pública de la MV Desarrollo
const BASE_URL = process.env.BASE_URL || `http://98.89.173.107:${port}`;


const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Microservicios",
      version: "1.0.0",
      description: "Documentación de todas las rutas del proyecto",
    },
    servers: [{ url: BASE_URL }],
    components: {
      schemas: {
        ScrapedAccount: {
          type: "object",
          properties: {
            id: { type: "integer" },
            accountName: { type: "string" },
            userId: { type: "integer" },
            scrapedAt: { type: "string", format: "date-time" },
          },
        },
      },
      securitySchemes: {
        ApiKeyAuth: { type: "apiKey", in: "header", name: "x-user-id" },
      },
    },
  },
  apis: [process.env.NODE_ENV === "production" ? "./dist/routes/*.js" : "./src/routes/*.ts"],
});

// Ruta Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use("/questions", questionsRoutes);
app.use("/historial", userApifyCallHistorialRoutes);
app.use("/filters", userApifyCallRoutes);
app.use("/scrapedAccounts", scrapedAccountRoutes);

// Ruta de prueba
app.get("/", (_: Request, res: Response) => {
  res.json({ message: "Echo Test OK" });
});

// Middleware global de errores
app.use((err: any, _: Request, res: Response, __: NextFunction) => {
  console.error("❌ Error inesperado:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Inicializar DB y levantar servidor
initDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 API corriendo en ${BASE_URL}`);
      console.log(`📄 Swagger UI disponible en ${BASE_URL}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("Error iniciando la app:", err);
  });