import { Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { BaseOrmEntity } from "../base-orm-entity";
import { Customer } from "../customer/customer.entity";
import { TransactionHistory } from "./transaction-history.entity";
import { BatchTransactionHistory } from "./batch-transaction-history.entity";
import { Balance } from "./balance.entity";
import { Statement } from "./statement.entity";

@Entity('wallet')
export class Wallet extends BaseOrmEntity {
  constructor() {
    super();
  }

  @OneToOne(() => Customer, (customer) => customer.wallet)
  @JoinColumn()
  customer: Customer;

  @OneToMany(() => TransactionHistory, (transaction) => transaction.wallet)
  transactionsHistory: TransactionHistory[];

  @OneToMany(() => BatchTransactionHistory, (batchTransaction) => batchTransaction.wallet)
  batchTransactionsHistory: BatchTransactionHistory[];

  @OneToOne(() => Balance, (balance) => balance.wallet)
  balance: Balance;

  @OneToMany(() => Statement, (statement) => statement.wallet)
  statement: Statement[];
}