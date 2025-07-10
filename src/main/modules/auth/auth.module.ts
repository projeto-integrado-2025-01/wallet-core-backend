
import { LoginService } from 'src/domain/auth/use-cases/login.service';
import { LoginController } from 'src/application/controllers/auth/login.controller';
import { CustomerRepository } from 'src/infra/repositories/customer.repository';
import { HashProvider } from 'src/infra/gateways/hash-provider';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({})
  ],
  controllers: [LoginController],
  providers: [
    LoginService,
    CustomerRepository,
    HashProvider,
  ],
})
export class AuthModule {}

