import { TransactionHistory } from "../entities/transaction/transaction-history.entity";
import { dataSource } from "../database/datasource.config";

import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TransactionHistoryRepository extends Repository<TransactionHistory> {
  constructor() {
    super(TransactionHistory, dataSource.createEntityManager());
  }
}