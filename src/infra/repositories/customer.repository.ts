import { Customer } from "../entities/customer/customer.entity";
import { dataSource } from "../database/datasource.config";

import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomerRepository extends Repository<Customer> {
  constructor() {
    super(Customer, dataSource.createEntityManager());
  }
}