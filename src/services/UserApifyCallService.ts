import { AppDataSource } from "../config/database";
import { UserApifyFilters } from "../entity/UserApifyFilters";
import { UserFiltersRequestDTO } from "../dto/UserFiltersRequestDTO";
import { Repository } from "typeorm";
import { UserApifyFiltersRepository } from "../repository/UserApifyFiltersRepository";
import { UserApifyCallHistorialRepository } from "../repository/UserApifyCallHistorialRepository";

export class UserApifyCallService {
  private repository: Repository<UserApifyFilters>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserApifyFilters);
  }

  async createFilter(dto: UserFiltersRequestDTO, userId: number): Promise<UserApifyFilters> {
    let historial = await UserApifyCallHistorialRepository.findOne({
      where: { userId },
      relations: ["filtros"],
    });

    if (!historial) {
      historial = UserApifyCallHistorialRepository.create({ userId, filtros: [] });
      await UserApifyCallHistorialRepository.save(historial);
    }

    const newFilter = UserApifyFiltersRepository.create({
      filterName: dto.filterName,
      filterConfig: dto.filterConfig,
      status: dto.status,
      historial,
    });

    return await UserApifyFiltersRepository.save(newFilter);
  }

  async getAllFilters(): Promise<UserApifyFilters[]> {
    return await this.repository.find({ relations: ["historial"] });
  }

  async getFilterById(id: number): Promise<UserApifyFilters | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ["historial"],
    });
  }  
}
