import { CreateBatchTransactionService } from 'src/domain/transaction/use-cases/create-batch-transaction.service';
import { JwtGuard } from 'src/domain/auth/guard/jwt.guard';

import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { RequestCustomer } from 'src/domain/auth/interfaces/request-customer';

@Controller('transactions')
@ApiTags('Transactions')
export class CreateBatchTransactionController {
  constructor(
    private readonly createBatchTransactionService: CreateBatchTransactionService,
  ) {}

  @Post('/batch')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Batch transaction creation',
    description:
      'This endpoint is responsible for creating a batch transaction.',
  })
  @ApiOkResponse({
    description: 'Transaction Created',
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
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ): Promise<any> {
    const customerData: RequestCustomer  = request['customer'];
    const buffer = file.buffer;
    return this.createBatchTransactionService.execute({ buffer, customer: customerData });
  }
}