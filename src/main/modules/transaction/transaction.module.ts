import { Module } from '@nestjs/common';
import { CreateSingleTransactionService } from 'src/domain/transaction/use-cases/create-single-transaction.service';
import { CreateSingleTransactionController } from 'src/application/controllers/transaction/create-single-transaction.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WalletRepository } from 'src/infra/repositories/wallet.repository';
import { TransactionHistoryRepository } from 'src/infra/repositories/customer.repository';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@localhost:5672'],
          queue: 'finance.transaction.process',
          queueOptions: {
            durable: true,
          }
        }
      }
    ]),
  ],
  controllers: [CreateSingleTransactionController],
  providers: [
    WalletRepository,
    TransactionHistoryRepository,
    CreateSingleTransactionService,
  ],
})
export class TransactionModule {}
