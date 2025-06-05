import { Column, Entity, OneToOne } from "typeorm";
import { BaseOrmEntity } from "../base-orm-entity";
import { Wallet } from "../transaction/wallet.entity";

@Entity('customer')
export class Customer extends BaseOrmEntity {
  constructor() {
    super();
  }

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: false })
  birthDate: Date;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  document: string;

  @OneToOne(() => Wallet, (wallet) => wallet.customer)
  wallet: Wallet;
}