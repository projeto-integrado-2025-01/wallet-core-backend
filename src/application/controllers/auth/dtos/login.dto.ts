import {
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @Expose()
  @ApiProperty({
    description: 'customer document',
    example: '11122233345',
    required: true,
  })
  @IsString({ message: "cpf deve ser uma string" })
  @IsNotEmpty({ message: "cpf é obrigatório" })
  cpf: string;

  @Expose()
  @ApiProperty({
    description: 'customer password',
    example: 'any password',
    required: true,
  })
  @IsString({ message: "password deve ser uma string" })
  @IsNotEmpty({ message: "password é obrigatório" })
  password: string;
}
