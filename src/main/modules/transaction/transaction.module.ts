import { Module } from '@nestjs/common';
import { CreateSingleTransactionService } from 'src/domain/transaction/use-cases/create-single-transaction.service';
import { CreateSingleTransactionController } from 'src/application/controllers/transaction/create-single-transaction.controller';
import { CreateBatchTransactionController } from 'src/application/controllers/transaction/create-batch-transaction.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WalletRepository } from 'src/infra/repositories/wallet.repository';
import { CreateBatchTransactionService } from 'src/domain/transaction/use-cases/create-batch-transaction.service';
import { AwsS3FileStorage } from 'src/infra/gateways/aws-s3-file-storage';
import { BatchTransactionHistoryRepository } from 'src/infra/repositories/batch-transaction-history.repository';
import { XlsxFileReader } from 'src/infra/gateways/xlsx-file-reader';
import { TransactionHistoryRepository } from 'src/infra/repositories/transaction-history.repository';
import { AuthModule } from '../auth/auth.module';
import { BalanceRepository } from 'src/infra/repositories/balance.repository';
import { StatementRepository } from 'src/infra/repositories/statement.repository';
import { GetWalletBalanceController } from 'src/application/controllers/transaction/get-wallet-balance.controller';
import { GetWalletBalanceService } from 'src/domain/transaction/use-cases/get-wallet-balance.service';
import { GetWalletStatementController } from 'src/application/controllers/transaction/get-wallet-statement.controller';
import { GetWalletStatementService } from 'src/domain/transaction/use-cases/get-wallet-statement.service';
import { TransactionConsumerController } from 'src/application/controllers/transaction/transaction-consumer.controller';
import { UpdateTransactionStatusEventService } from 'src/domain/transaction/use-cases/update-transaction-status-event.service';

@Module({
  imports: [
    AuthModule,
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
      },
      {
        name: 'BATCH_TRANSACTION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@localhost:5672'],
          queue: 'finance.batch.transaction.process',
          queueOptions: {
            durable: true,
          }
        }
      }
    ]),
  ],
  controllers: [
    CreateSingleTransactionController,
    CreateBatchTransactionController,
    GetWalletBalanceController,
    GetWalletStatementController,
    TransactionConsumerController,
  ],
  providers: [
    WalletRepository,
    TransactionHistoryRepository,
    CreateSingleTransactionService,
    CreateBatchTransactionService,
    AwsS3FileStorage,
    BatchTransactionHistoryRepository,
    XlsxFileReader,
    BalanceRepository,
    StatementRepository,
    GetWalletBalanceService,
    GetWalletStatementService,
    UpdateTransactionStatusEventService
  ],
})
export class TransactionModule {}
