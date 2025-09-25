import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { initDatabase } from "./config/database";
import path from "path";

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
const BASE_URL = process.env.BASE_URL || `http://98.89.173.107:${port}`;

// ✅ Configuración corregida de swaggerSpec
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
  // ✅ Busca tanto en dist/*.js como en src/*.ts
  apis: [
    path.resolve(__dirname, "./routes/*.{ts,js}"),
    path.resolve(__dirname, "./controller/*.{ts,js}"), // opcional si luego documentas controllers
  ],
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

      // 👇 Debug: imprime las rutas detectadas por swagger-jsdoc
      console.log("📂 Swagger está leyendo anotaciones desde:");
      console.log(
        path.resolve(__dirname, "./routes/*.{ts,js}"),
        path.resolve(__dirname, "./controller/*.{ts,js}")
      );
    });
  })
  .catch((err) => {
    console.error("Error iniciando la app:", err);
  });
