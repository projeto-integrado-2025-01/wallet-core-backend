import { WalletRepository } from "src/infra/repositories/wallet.repository";
import { CreateSingleTransactionDto } from "src/application/controllers/transaction/dtos/create-single-transaction/create-single-transaction.dto";
import { TransactionHistoryRepository } from "src/infra/repositories/transaction-history.repository";
import { Wallet } from "src/infra/entities/transaction/wallet.entity";
import { TransactionHistory } from "src/infra/entities/transaction/transaction-history.entity";
import { CreateSingleTransactionResponseDto } from "src/application/controllers/transaction/dtos/create-single-transaction/create-single-transaction-response.dto";
import { RequestCustomer } from "src/domain/auth/interfaces/request-customer";
import { BalanceRepository } from "src/infra/repositories/balance.repository";
import { StatementRepository } from "src/infra/repositories/statement.repository";

import { randomUUID } from 'crypto';
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { TrasactionStatus } from "../enums/transaction-status.enum";

@Injectable()
export class CreateSingleTransactionService {
  constructor(
    @Inject("TRANSACTION_SERVICE")
    private readonly transactionQueue: ClientProxy,
    private readonly walletRepository: WalletRepository,
    private readonly transactionHistoryRepository: TransactionHistoryRepository,
    private readonly balanceRepository: BalanceRepository,
    private readonly statementRepository: StatementRepository,
  ) {}

  async execute(data: CreateSingleTransactionDto, customer: RequestCustomer): Promise<CreateSingleTransactionResponseDto> {
    const endToEndId = randomUUID();
    const wallet = await this.getCustomerWallet(customer.walletId);

    await this.validateWalletBalance(wallet, data.value);
    const transactionHistory = await this.createTransactionHistory(wallet, endToEndId, data);
    await this.removeWalletBalance(wallet, data.value);
    await this.registerStatement(wallet, data.value, endToEndId, data.pixKey);

    await this.transactionQueue.connect();
    this.transactionQueue.emit('SINGLE_TRANSACTION_CREATED', {
      endToEndId,
      ...data
    });

    return CreateSingleTransactionResponseDto.toDto(transactionHistory);
  }

  private async getCustomerWallet(walletId: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
      relations: ['customer', 'transactionsHistory', 'balance', 'statement']
    });
    if (!wallet) {
      throw new BadRequestException("Carteira não encontrada para o usuário.");
    }
    return wallet;
  }

  private async validateWalletBalance(wallet: Wallet, amount: number): Promise<void> {
    const balance = wallet.balance;
    if(amount > balance.value) {
      throw new BadRequestException("Saldo insuficiente na carteira do usuário.");
    }
  }

  private async createTransactionHistory(
    wallet: Wallet,
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
    const balanceId = wallet.balance.id as number;
    const currentBalance = wallet.balance.value;
    const newBalance = currentBalance - amount;
    await this.balanceRepository.update(balanceId, {
      value: newBalance
    });
  }

  private async registerStatement(wallet: Wallet, amount: number, endToEndId: string, pixKey: string): Promise<void> {
    const statement = this.statementRepository.create({
      wallet,
      value: amount,
      status: TrasactionStatus.PENDING,
      endToEndId,
      pixKey
    });
    await this.statementRepository.save(statement);
  }
}