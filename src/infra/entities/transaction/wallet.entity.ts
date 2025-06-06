import { Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { BaseOrmEntity } from "../base-orm-entity";
import { Customer } from "../customer/customer.entity";
import { TransactionHistory } from "./transaction-history.entity";

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
}