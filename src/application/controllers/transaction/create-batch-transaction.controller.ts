import { CreateBatchTransactionService } from 'src/domain/transaction/use-cases/create-batch-transaction.service';

import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

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
  async handle(
    @UploadedFile() file: Express.Multer.File
  ): Promise<any> {
    return this.createBatchTransactionService.execute(file);
  }
}