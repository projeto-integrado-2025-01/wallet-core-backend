import { CreateSingleTransactionService } from 'src/domain/transaction/use-cases/create-single-transaction.service';
import { CreateSingleTransactionDto } from './dtos/create-single-transaction/create-single-transaction.dto';
import { CreateSingleTransactionResponseDto } from './dtos/create-single-transaction/create-single-transaction-response.dto';
import { JwtGuard } from 'src/domain/auth/guard/jwt.guard';

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { RequestCustomer } from 'src/domain/auth/interfaces/request-customer';

@Controller('transactions')
@ApiTags('Transactions')
export class CreateSingleTransactionController {
  constructor(
    private readonly createSingleTransactionService: CreateSingleTransactionService,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Transaction creation',
    description:
      'This endpoint is responsible for creating a single transaction.',
  })
  @ApiOkResponse({
    description: 'Transaction Created',
    type: CreateSingleTransactionResponseDto
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - invalid authentication',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid transaction data',
  })
  @UseGuards(JwtGuard)
  async handle(
    @Body() createSingleTransactionDto: CreateSingleTransactionDto,
    @Req() request: Request,
  ): Promise<CreateSingleTransactionResponseDto> {
    const customerData: RequestCustomer  = request['customer'];
    return this.createSingleTransactionService.execute(createSingleTransactionDto, customerData);
  }
}