import { CreateSingleTransactionService } from 'src/domain/transaction/use-cases/create-single-transaction.service';
import { CreateSingleTransactionDto } from './dtos/create-single-transaction/create-single-transaction.dto';
import { CreateSingleTransactionResponseDto } from './dtos/create-single-transaction/create-single-transaction-response.dto';

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

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
  async handle(
    @Body() createSingleTransactionDto: CreateSingleTransactionDto,
  ): Promise<CreateSingleTransactionResponseDto> {
    return this.createSingleTransactionService.execute(createSingleTransactionDto);
  }
}