import {
  IsString,
  IsDateString,
  IsObject,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @Expose()
  @ApiProperty({
    description: 'Customer full name',
    example: 'Nome Completo',
    required: true,
  })
  @IsString({ message: "fullName deve ser uma string" })
  fullName: string;

  @Expose()
  @ApiProperty({
    description: 'Customer birth date',
    example: '2000-01-01 10:30:00',
    required: true,
  })
  @IsDateString({}, { message: "birthDate deve estar no formato YYYY-MM-DD HH:II:SS" })
  birthDate: Date;

  @Expose()
  @ApiProperty({
    description: 'customer email',
    example: 'email@email.com',
    required: true,
  })
  @IsString({ message: "email deve ser uma string" })
  email: string;

  @Expose()
  @ApiProperty({
    description: 'customer phone',
    example: '35988672413',
    required: true,
  })
  @IsString({ message: "phone deve ser uma string" })
  phone: string;

  @Expose()
  @ApiProperty({
    description: 'customer document',
    example: '11122233345',
    required: true,
  })
  @IsString({ message: "document deve ser uma string" })
  document: string;
}
