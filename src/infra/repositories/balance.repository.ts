import { dataSource } from "../database/datasource.config";
import { Balance } from "../entities/transaction/balance.entity";

import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BalanceRepository extends Repository<Balance> {
  constructor() {
    super(Balance, dataSource.createEntityManager());
  }
}