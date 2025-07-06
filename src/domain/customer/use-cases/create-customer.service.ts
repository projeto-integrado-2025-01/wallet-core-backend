import { CustomerRepository } from "src/infra/repositories/customer.repository";
import { WalletRepository } from "src/infra/repositories/wallet.repository";

import { ConflictException, Injectable } from "@nestjs/common";
import { CreateCustomerDto } from "src/application/controllers/customer/dtos/create-customer.dto";
import { DataFormater } from "src/infra/gateways/dataFormater";

@Injectable()
export class CreateCustomerService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly dataFormater: DataFormater,
  ) {}

  async execute(data: CreateCustomerDto): Promise<any> {
    this.formatData(data);
    await this.validateExistingUser(data);

    const wallet = await this.walletRepository.save({});
    const customer = this.customerRepository.create({
      ...data,
      wallet
    });
    await this.customerRepository.save(customer);

    return customer;
  }

  private formatData(data: CreateCustomerDto): void {
    data = this.dataFormater.trimData(data);
    data.phone = this.dataFormater.extractOnlyNumbers(data.phone);
    data.document = this.dataFormater.extractOnlyNumbers(data.document);
  }

  private async validateExistingUser(data: CreateCustomerDto): Promise<void> {
    await this.validateExistingEmail(data.email);
    await this.validateExistingDocument(data.document);
  }

  private async validateExistingEmail(email: string): Promise<void> {
    const existingCustomer = await this.customerRepository.findOne({
      where: {
        email
      }
    });
    if(existingCustomer) {
      throw new ConflictException("Já existe um usuário cadastrado com esse email.");
    }
  }

  private async validateExistingDocument(document: string): Promise<void> {
    const existingCustomer = await this.customerRepository.findOne({
      where: {
        document
      }
    });
    if(existingCustomer) {
      throw new ConflictException("Já existe um usuário cadastrado com esse documento.");
    }
  }
}