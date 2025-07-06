import { WalletRepository } from "src/infra/repositories/wallet.repository";
import { CreateSingleTransactionDto } from "src/application/controllers/transaction/dtos/create-single-transaction/create-single-transaction.dto";
import { TransactionHistoryRepository } from "src/infra/repositories/transaction-history.repository";
import { Wallet } from "src/infra/entities/transaction/wallet.entity";

import { randomUUID } from 'crypto';
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { TransactionHistory } from "src/infra/entities/transaction/transaction-history.entity";
import { CreateSingleTransactionResponseDto } from "src/application/controllers/transaction/dtos/create-single-transaction/create-single-transaction-response.dto";

@Injectable()
export class CreateSingleTransactionService {
  constructor(
    @Inject("TRANSACTION_SERVICE")
    private readonly transactionQueue: ClientProxy,
    private readonly walletRepository: WalletRepository,
    private readonly transactionHistoryRepository: TransactionHistoryRepository, 
  ) {}

  async execute(data: CreateSingleTransactionDto): Promise<CreateSingleTransactionResponseDto> {
    const endToEndId = randomUUID();
    const userId = 1;
    const wallet = await this.getCustomerWallet(userId);

    await this.validadeWalletBalance(userId, data.value);
    const transactionHistory = await this.createTransactionHistory(wallet, userId, endToEndId, data);
    await this.removeWalletBalance(wallet, data.value);

    await this.transactionQueue.connect();
    this.transactionQueue.emit('SINGLE_TRANSACTION_CREATED', {
      endToEndId,
      ...data
    });

    return CreateSingleTransactionResponseDto.toDto(transactionHistory);
  }

  private async getCustomerWallet(userId: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findWalletByCustomerId(userId);
    if (!wallet) {
      throw new BadRequestException("Carteira não encontrada para o usuário.");
    }
    return wallet;
  }

  private async validadeWalletBalance(userId: number, amount: number): Promise<void> {
    if(amount > 1000) {
      throw new BadRequestException("Saldo insuficiente na carteira do usuário.");
    }
  }

  private async createTransactionHistory(
    wallet: Wallet,
    userId: number,
    endToEndId: string,
    data: CreateSingleTransactionDto, 
  ): Promise<TransactionHistory> {
    const transactionHistory = this.transactionHistoryRepository.create({
      wallet,
      endToEndId
    });
    await this.transactionHistoryRepository.save(transactionHistory);
    return transactionHistory;
  }

  private async removeWalletBalance(wallet: Wallet, amount: number): Promise<void> {
    // comunicar com serviço de saldo para remover o saldo da carteira
  }
}