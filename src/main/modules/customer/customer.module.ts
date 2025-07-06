import { WalletRepository } from 'src/infra/repositories/wallet.repository';
import { CreateCustomerController } from 'src/application/controllers/customer/create-customer.controller';
import { CreateCustomerService } from 'src/domain/customer/use-cases/create-customer.service';
import { CustomerRepository } from 'src/infra/repositories/customer.repository';

import { Module } from '@nestjs/common';
import { DataFormater } from 'src/infra/gateways/dataFormater';

@Module({
  imports: [],
  controllers: [CreateCustomerController],
  providers: [
    CreateCustomerService,
    WalletRepository,
    CustomerRepository,
    DataFormater,
  ],
})
export class CustomerModule {}
