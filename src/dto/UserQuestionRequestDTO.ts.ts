import { IsInt, IsNotEmpty, IsString, IsDefined } from "class-validator";

export class UserQuestionRequestDTO {
  @IsDefined()
  @IsInt()
  userId!: number;

  @IsString()
  @IsNotEmpty()
  questionDescription!: string;
}
