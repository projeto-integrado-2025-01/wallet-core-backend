import { Expose, plainToClass } from "class-transformer";

export class CreateCustomerResponseDto {
  @Expose()
  id: string;

  @Expose()
  isActive: boolean;

  @Expose()
  fullName: string;

  @Expose()
  birthDate: Date;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  document: string;

  @Expose()
  createdAt: Date;

  static toDto(data: any) {
    return plainToClass(CreateCustomerResponseDto, data, {
      excludeExtraneousValues: true
    })
  }
}