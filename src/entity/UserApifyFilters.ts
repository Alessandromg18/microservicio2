import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { ApifyRunStatus } from "./enums/ApifyRunStatus";
import { UserApifyCallHistorial } from "./UserApifyCallHistorial";

@Entity({ name: "user_apify_filters" })
export class UserApifyFilters {
  @PrimaryGeneratedColumn()
  id!: number;

  

  @Column({ type: "varchar", length: 255 })
  @Index()
  filterName!: string;


  @Column({ type: "text", nullable: true })
  filterConfig?: string;

  @Column({
  type: "simple-enum",
  enum: ApifyRunStatus,
  default: ApifyRunStatus.COMPLETED,
})
status!: ApifyRunStatus;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
createdAt!: Date;

  @ManyToOne(() => UserApifyCallHistorial, (historial) => historial.filtros, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "historial_id" })
  historial!: UserApifyCallHistorial;

  
}
