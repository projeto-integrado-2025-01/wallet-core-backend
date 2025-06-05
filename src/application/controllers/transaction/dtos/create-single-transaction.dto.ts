
import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSingleTransactionDto {
  @Expose()
  @ApiProperty({
    description: 'Value of the transaction',
    example: '200.00',
    required: true,
  })
  @IsNumber({}, { message: "Value deve ser um número" })
  value: number;

  @Expose()
  @ApiProperty({
    description: 'Pix key for the transaction',
    example: 'any key',
    required: true,
  })
  @IsString({ message: "pixKey deve ser uma string" })
  pixKey: string;

  @Expose()
  @ApiProperty({
    description: 'Pix key type',
    example: 'cpf',
    required: true,
  })
  @IsString({ message: "pixKeyType deve ser uma string" })
  pixKeyType: string;

  @Expose()
  @ApiProperty({
    description: 'Schedule date for the transaction',
    example: '2025-12-31T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  scheduleDate?: Date;
}
