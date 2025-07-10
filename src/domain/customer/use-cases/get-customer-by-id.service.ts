import { CustomerRepository } from "src/infra/repositories/customer.repository";
import { GetCustomerByIdResponseDto } from "src/application/controllers/customer/dtos/get-customer-by-id-response.dto";

import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class GetCustomerByIdService {
  constructor(
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(id: number): Promise<GetCustomerByIdResponseDto> {
    const existingCustomer = await this.customerRepository.findOne({
      where: {
        id
      }
    });
    if(!existingCustomer) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    return GetCustomerByIdResponseDto.toDto(existingCustomer);
  }
}
