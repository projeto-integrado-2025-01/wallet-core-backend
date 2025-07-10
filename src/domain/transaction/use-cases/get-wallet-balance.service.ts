import { WalletRepository } from "src/infra/repositories/wallet.repository";
import { RequestCustomer } from "src/domain/auth/interfaces/request-customer";
import { BadRequestException, Injectable } from "@nestjs/common";


@Injectable()
export class GetWalletBalanceService {
  constructor(
    private readonly walletRepository: WalletRepository,
  ) {}

  async execute(customer: RequestCustomer): Promise<any> {
    const walletId = customer.walletId;
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
      relations: ["balance"]
    });

    if(!wallet) {
      throw new BadRequestException("Carteira do usuário não encontrada. Não se preocupe, entre em contato com o suporte.");
    }

    return { balance: wallet.balance.value };
  }
}