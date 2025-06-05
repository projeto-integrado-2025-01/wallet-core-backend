import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from './main/modules/transaction/transaction.module';
import { dataSource } from './infra/database/datasource.config';
import { Wallet } from './infra/entities/transaction/wallet.entity';
import { Customer } from './infra/entities/customer/customer.entity';
import { TransactionHistory } from './infra/entities/transaction/transaction-history.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      dataSourceFactory: async () => {
        await dataSource.initialize();
        return dataSource;
      },
      useFactory: () => ({}),
    }),
    TypeOrmModule.forFeature([
      Wallet,
      Customer,
      TransactionHistory,
      
    ]),
    TransactionModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
