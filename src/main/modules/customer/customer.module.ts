import { GetCustomerByIdController } from 'src/application/controllers/customer/get-customer-by-id.controller';
import { CreateCustomerController } from 'src/application/controllers/customer/create-customer.controller';
import { GetCustomerByIdService } from 'src/domain/customer/use-cases/get-customer-by-id.service';
import { CreateCustomerService } from 'src/domain/customer/use-cases/create-customer.service';
import { CustomerRepository } from 'src/infra/repositories/customer.repository';
import { WalletRepository } from 'src/infra/repositories/wallet.repository';
import { DataFormater } from 'src/infra/gateways/dataFormater';

import { Module } from '@nestjs/common';
import { HashProvider } from 'src/infra/gateways/hash-provider';

@Module({
  imports: [],
  controllers: [CreateCustomerController, GetCustomerByIdController],
  providers: [
    CreateCustomerService,
    GetCustomerByIdService,
    WalletRepository,
    CustomerRepository,
    DataFormater,
    HashProvider,
  ],
})
export class CustomerModule {}
