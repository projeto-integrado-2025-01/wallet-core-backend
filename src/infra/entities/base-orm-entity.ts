import { Exclude } from "class-transformer";
import { Column, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseOrmEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn({ nullable: true })
  @Exclude()
  deletedAt?: Date;
}
