import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class CreateSingleTransactionService {
  constructor(
    @Inject("TRANSACTION_SERVICE")
    private readonly transactionQueue: ClientProxy
  ) {}

  async execute(data): Promise<any> {
    await this.transactionQueue.connect();
    this.transactionQueue.emit('SINGLE_TRANSACTION_CREATED', data);
    return 'ola mundo'
  }
}