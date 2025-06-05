import { Repository } from "typeorm";
import { Wallet } from "../entities/transaction/wallet.entity";
import { dataSource } from "../database/datasource.config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class WalletRepository extends Repository<Wallet> {
  constructor() {
    super(Wallet, dataSource.createEntityManager());
  }

  async findWalletByCustomerId(customerId: number): Promise<Wallet | null> {
    return this.findOne({
      where: { customer: { id: customerId } },
      relations: ['customer', 'transactionsHistory'],
    });
  }
}