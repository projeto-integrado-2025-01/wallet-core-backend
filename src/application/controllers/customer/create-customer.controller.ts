import { CreateCustomerDto } from './dtos/create-customer.dto';
import { CreateCustomerService } from 'src/domain/customer/use-cases/create-customer.service';

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

@Controller('customers')
@ApiTags('Customers')
export class CreateCustomerController {
  constructor(
    private readonly createCustomerService: CreateCustomerService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Transaction creation',
    description:
      'This endpoint is responsible for creating a single transaction.',
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
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<any> {
    return this.createCustomerService.execute(createCustomerDto);
  }
}