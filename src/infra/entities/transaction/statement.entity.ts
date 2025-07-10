import { Column, Entity, ManyToOne } from "typeorm";
import { BaseOrmEntity } from "../base-orm-entity";
import { Wallet } from "./wallet.entity";

@Entity('statement')
export class Statement extends BaseOrmEntity {
  constructor() {
    super();
  }

  @ManyToOne(() => Wallet, (wallet) => wallet.statement)
  wallet: Wallet;

  @Column()
  endToEndId: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: false })
  value: number;

  @Column({ nullable: true })
  pixKey: string;
}