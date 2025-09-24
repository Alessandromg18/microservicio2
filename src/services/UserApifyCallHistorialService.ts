import { UserApifyCallHistorialRepository } from "../repository/UserApifyCallHistorialRepository";
import { UserApifyCallHistorial } from "../entity/UserApifyCallHistorial";

export class UserApifyCallHistorialService {
  async createHistorial(userId: number): Promise<UserApifyCallHistorial> {
    let historial = await UserApifyCallHistorialRepository.findOne({
      where: { userId },
      relations: ["filtros"],
    });

    if (!historial) {
      historial = new UserApifyCallHistorial();
      historial.userId = userId;
      historial.filtros = [];
      historial = await UserApifyCallHistorialRepository.save(historial);
    }

    return historial;
  }

  async getHistorialByUser(userId: number): Promise<UserApifyCallHistorial | null> {
    return await UserApifyCallHistorialRepository.findOne({
      where: { userId },
      relations: ["filtros"],
    });
  }

  async getAllHistoriales(): Promise<UserApifyCallHistorial[]> {
    return await UserApifyCallHistorialRepository.find({
      relations: ["filtros"],
    });
  }
}
