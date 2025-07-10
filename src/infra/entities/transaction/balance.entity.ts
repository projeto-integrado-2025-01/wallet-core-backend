import { Wallet } from "./wallet.entity";
import { BaseOrmEntity } from "../base-orm-entity";

import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity('balance')
export class Balance extends BaseOrmEntity {
  constructor() {
    super();
  }

  @OneToOne(() => Wallet, (wallet) => wallet.balance)
  @JoinColumn()
  wallet: Wallet;

  @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  value: number
}