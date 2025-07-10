import { RequestCustomer } from 'src/domain/auth/interfaces/request-customer';
import { GetWalletStatementService } from 'src/domain/transaction/use-cases/get-wallet-statement.service';
import { JwtGuard } from 'src/domain/auth/guard/jwt.guard';

import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req,
  Get
} from '@nestjs/common';
import {
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

@Controller('statement')
@ApiTags('Statement')
export class GetWalletStatementController {
  constructor(
    private readonly getWalletStatementService: GetWalletStatementService,
  ) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async handle(@Req() request: Request,): Promise<{ balance: number }> {
    const customerData: RequestCustomer  = request['customer'];
    return this.getWalletStatementService.execute(customerData);
  }
}