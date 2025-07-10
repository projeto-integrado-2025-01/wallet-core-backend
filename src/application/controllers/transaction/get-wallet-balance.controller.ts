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
import { RequestCustomer } from 'src/domain/auth/interfaces/request-customer';
import { GetWalletBalanceService } from 'src/domain/transaction/use-cases/get-wallet-balance.service';

@Controller('balance')
@ApiTags('Balance')
export class GetWalletBalanceController {
  constructor(
    private readonly getWalletBalanceService: GetWalletBalanceService,
  ) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async handle(@Req() request: Request,): Promise<{ balance: number }> {
    const customerData: RequestCustomer  = request['customer'];
    return this.getWalletBalanceService.execute(customerData);
  }
}