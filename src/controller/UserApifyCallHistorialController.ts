import { Request, Response } from "express";
import { UserApifyCallHistorialService } from "../services/UserApifyCallHistorialService";

const historialService = new UserApifyCallHistorialService();

export class UserApifyCallHistorialController {
  async createHistorial(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user?.id) {
        res.status(400).json({ error: "userId no detectado en request" });
        return;
      }

      const historial = await historialService.createHistorial(Number(user.id));
      res.status(201).json(historial);
    } catch (error) {
      res.status(500).json({ error: "Error creating historial" });
    }
  }

  async getHistorialByUser(req: Request, res: Response): Promise<void> {
  try {
    const user = (req as any).user;
    const requestedUserId = Number(req.params.userId);

    // Si es USER, solo puede pedir su propio historial
    if (user.role === "USER" && user.id !== requestedUserId) {
      res.status(403).json({ error: "Forbidden: cannot view another user's historial" });
      return;
    }

    const historial = await historialService.getHistorialByUser(requestedUserId);

    if (!historial) {
      res.status(404).json({ error: "Historial not found for this user" });
      return;
    }

    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: "Error fetching historial" });
  }
}


  async getAllHistoriales(req: Request, res: Response): Promise<void> {
    try {
      const historiales = await historialService.getAllHistoriales();
      res.json(historiales);
    } catch (error) {
      res.status(500).json({ error: "Error fetching historiales" });
    }
  }
}
