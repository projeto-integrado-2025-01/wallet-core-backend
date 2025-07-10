
import { LoginService } from 'src/domain/auth/use-cases/login.service';
import { LoginController } from 'src/application/controllers/auth/login.controller';
import { CustomerRepository } from 'src/infra/repositories/customer.repository';
import { HashProvider } from 'src/infra/gateways/hash-provider';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtGuard } from 'src/domain/auth/guard/jwt.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
      }),
      global: true
    })
  ],
  controllers: [LoginController],
  providers: [
    LoginService,
    CustomerRepository,
    HashProvider,
    JwtGuard
  ],
  exports: [
    JwtGuard,
    CustomerRepository
  ]
})
export class AuthModule {}

