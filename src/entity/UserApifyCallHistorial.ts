import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { UserApifyFilters } from "./UserApifyFilters";

@Entity({ name: "user_apify_call_historial" })
export class UserApifyCallHistorial {
  @PrimaryGeneratedColumn()
  id!: number;

  // Guardamos solo el ID del usuario (viene de MS1 vía MS4)
  @Column({ name: "user_id", type: "int", nullable: false })
  userId!: number;

  @OneToMany(() => UserApifyFilters, (filtro) => filtro.historial, {
    cascade: true,
    eager: true,
  })
  filtros!: UserApifyFilters[];

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
startDate!: Date;

@Column({ type: "datetime", nullable: true })
endDate?: Date;

@Column({ type: "int", nullable: true })
executionTime?: number;

}
