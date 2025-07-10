import { dataSource } from "../database/datasource.config";
import { Statement } from "../entities/transaction/statement.entity";

import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StatementRepository extends Repository<Statement> {
  constructor() {
    super(Statement, dataSource.createEntityManager());
  }
}