import { CustomerRepository } from 'src/infra/repositories/customer.repository';
import { RequestCustomer } from '../interfaces/request-customer';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private customerRepository: CustomerRepository,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("Autenticação falhou. Token não informado.");
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload: RequestCustomer = await this.jwtService.verifyAsync(token, {
        secret: secret,
      });
      const customer = await this.customerRepository.findOneBy({ document: payload.cpf });
      if (!customer) {
        throw new UnauthorizedException();
      }
      request['customer'] = payload;
    } catch (error) {
      throw new UnauthorizedException("Autenticação falhou, faça login novamente.");
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
