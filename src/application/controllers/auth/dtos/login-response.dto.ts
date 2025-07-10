import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { GetCustomerByIdResponseDto } from '../../customer/dtos/get-customer-by-id-response.dto';

export class LoginResponseDto {
  @Expose()
  @ApiProperty({
    description: 'JWT authentication token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    required: true,
  })
  token: string;

  @Expose()
  @ApiProperty({
    description: 'JWT expiration time',
    example: '3600',
    required: true,
  })
  expiresIn: string;

  @Expose()
  @ApiProperty({
    description: 'Customer data',
    example: {
      id: 1,
      name: 'John Doe',
      email: 'john@mail.com',
    },
    required: true,
  })
  customer: GetCustomerByIdResponseDto;

  static toDto(data: any): LoginResponseDto {
    return plainToInstance(LoginResponseDto, data, {
      excludeExtraneousValues: false,
    });
  }
}
