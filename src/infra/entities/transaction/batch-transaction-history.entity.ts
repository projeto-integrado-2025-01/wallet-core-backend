import { Column, Entity, ManyToOne } from "typeorm";
import { BaseOrmEntity } from "../base-orm-entity";
import { Wallet } from "./wallet.entity";

@Entity('batch_transaction_history')
export class BatchTransactionHistory extends BaseOrmEntity {
  constructor() {
    super();
  }

  @ManyToOne(() => Wallet, (wallet) => wallet.transactionsHistory)
  wallet: Wallet;

  @Column()
  endToEndId: string;

  @Column({ nullable: true })
  authorized: boolean;

  @Column({ nullable: true })
  fileId: string;
}