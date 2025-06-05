import { Expose, plainToInstance } from "class-transformer";

export class CreateSingleTransactionResponseDto {
  @Expose()
  endToEndId: string;

  @Expose()
  createdAt: Date;

  static toDto(data): CreateSingleTransactionResponseDto {
    return plainToInstance(CreateSingleTransactionResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }
}

