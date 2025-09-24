// src/swagger.ts
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Rutas

import questionsRoutes from "../routes/scrapedAccountRoutes";
import userApifyCallHistorialRoutes from "../routes/userApifyCallHistorialRoutes";
import userApifyCallRoutes from "../routes/userApifyCallRoutes";

const app = express();
app.use(express.json());

// Rutas
app.use("/questions", questionsRoutes);
app.use("/historial", userApifyCallHistorialRoutes);
app.use("/filters", userApifyCallRoutes);

// Puerto y BASE_URL
const port = Number(process.env.PORT ?? 8005);
const BASE_URL = process.env.BASE_URL || `http://98.89.173.107:${port}`;

// Configuración Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
    },
    servers: [{ url: BASE_URL }], // 👈 importante para que Swagger use tu IP pública
  },
  // En producción los archivos serán .js en dist
  apis: ["./dist/routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on ${BASE_URL}`);
  console.log(`📄 Swagger docs available at ${BASE_URL}/api-docs`);
});
