import { BatchTransactionHistory } from "../entities/transaction/batch-transaction-history.entity";
import { dataSource } from "../database/datasource.config";

import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BatchTransactionHistoryRepository extends Repository<BatchTransactionHistory> {
  constructor() {
    super(BatchTransactionHistory, dataSource.createEntityManager());
  }
}