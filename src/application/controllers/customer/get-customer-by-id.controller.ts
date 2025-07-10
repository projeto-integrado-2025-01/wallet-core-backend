import { GetCustomerByIdService } from 'src/domain/customer/use-cases/get-customer-by-id.service';
import { GetCustomerByIdResponseDto } from './dtos/get-customer-by-id-response.dto';

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('customers')
@ApiTags('Customers')
export class GetCustomerByIdController {
  constructor(
    private readonly getCustomerByIdService: GetCustomerByIdService,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Customer by id read',
    description:
      'This endpoint is responsible for retrieving a customer by its id.',
  })
  @ApiOkResponse({
    description: 'Transaction Created',
    type: GetCustomerByIdResponseDto
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
    @Param('id') customerId: string
  ): Promise<GetCustomerByIdResponseDto> {
    return this.getCustomerByIdService.execute(Number(customerId));
  }
}