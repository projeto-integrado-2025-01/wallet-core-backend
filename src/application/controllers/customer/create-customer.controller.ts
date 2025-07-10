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
import { CreateCustomerResponseDto } from './dtos/create-customer-response.dto';

@Controller('customers')
@ApiTags('Customers')
export class CreateCustomerController {
  constructor(
    private readonly createCustomerService: CreateCustomerService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Customer creation',
    description:
      'This endpoint is responsible for creating a single customer.',
  })
  @ApiOkResponse({
    description: 'Transaction Created',
    type: CreateCustomerResponseDto
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - invalid authentication',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Invalid customer data',
  })
  async handle(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CreateCustomerResponseDto> {
    return this.createCustomerService.execute(createCustomerDto);
  }
}