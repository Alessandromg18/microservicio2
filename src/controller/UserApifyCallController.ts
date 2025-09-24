import { Request, Response } from "express";
import { UserApifyCallService } from "../services/UserApifyCallService";
import { UserFiltersRequestDTO } from "../dto/UserFiltersRequestDTO";
import { validate } from "class-validator";

export class UserApifyCallController {
  private service: UserApifyCallService;

  constructor() {
    this.service = new UserApifyCallService();
  }

  // USER crea un filtro asociado a su historial
  createFilter = async (req: Request, res: Response) => {
    const user = (req as any).user;

    const dto = new UserFiltersRequestDTO();
    dto.filterName = req.body.filterName;
    dto.filterConfig = req.body.filterConfig;
    dto.status = req.body.status;

    const errors = await validate(dto);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const newFilter = await this.service.createFilter(dto, Number(user.id));
    return res.status(201).json(newFilter);
  };

  // ADMIN y USER pueden ver cualquier filtro
  getAllFilters = async (_: Request, res: Response) => {
    const filters = await this.service.getAllFilters();
    return res.json(filters);
  };

  getFilterById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const filter = await this.service.getFilterById(id);
    if (!filter) return res.status(404).json({ message: "Filter not found" });
    return res.json(filter);
  };

}
