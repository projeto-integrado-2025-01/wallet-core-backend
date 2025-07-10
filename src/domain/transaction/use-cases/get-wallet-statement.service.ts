import { WalletRepository } from "src/infra/repositories/wallet.repository";
import { RequestCustomer } from "src/domain/auth/interfaces/request-customer";
import { BadRequestException, Injectable } from "@nestjs/common";
import { StatementRepository } from "src/infra/repositories/statement.repository";


@Injectable()
export class GetWalletStatementService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly statementRepository: StatementRepository,
  ) {}

  async execute(customer: RequestCustomer): Promise<any> {
    const walletId = customer.walletId;
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
      relations: ["balance", "statement"]
    });

    if(!wallet) {
      throw new BadRequestException("Carteira do usuário não encontrada. Não se preocupe, entre em contato com o suporte.");
    }

    const statement = wallet.statement;
    statement.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
    return { statement };
  }
}
