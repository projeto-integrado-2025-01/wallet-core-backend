import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from './main/modules/transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'wallet-core',
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: true,
    }),
    TransactionModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
