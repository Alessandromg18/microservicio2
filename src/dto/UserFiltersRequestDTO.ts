import { IsEnum, IsOptional, IsString, IsNotEmpty } from "class-validator";
import { ApifyRunStatus } from "../entity/enums/ApifyRunStatus";

export class UserFiltersRequestDTO {
  @IsString()
  @IsNotEmpty()
  filterName!: string;

  @IsString()
  @IsOptional()
  filterConfig?: string;

  @IsEnum(ApifyRunStatus)
  @IsOptional()
  status?: ApifyRunStatus;
}
