import { BatchTransactionHistoryRepository } from "src/infra/repositories/batch-transaction-history.repository";
import { WalletRepository } from "src/infra/repositories/wallet.repository";
import { AwsS3FileStorage } from "src/infra/gateways/aws-s3-file-storage";
import { XlsxFileReader } from "src/infra/gateways/xlsx-file-reader";
import { Wallet } from "src/infra/entities/transaction/wallet.entity";
import { BatchTransactionQueueData } from "../interfaces/batch-transaction-queue-data";
import { BatchTransactionFileRow } from "../interfaces/batch-transaction-file-row";
import { RequestCustomer } from "src/domain/auth/interfaces/request-customer";
import { BalanceRepository } from "src/infra/repositories/balance.repository";

import { randomUUID } from 'crypto';
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { StatementRepository } from "src/infra/repositories/statement.repository";
import { TrasactionStatus } from "../enums/transaction-status.enum";

@Injectable()
export class CreateBatchTransactionService {
  constructor(
    @Inject("BATCH_TRANSACTION_SERVICE")
    private readonly batchTransactionQueue: ClientProxy,
    private readonly fileUploader: AwsS3FileStorage,
    private readonly fileReader: XlsxFileReader,
    private readonly walletRepository: WalletRepository,
    private readonly batchTransactionHistoryRepository: BatchTransactionHistoryRepository, 
    private readonly balanceRepository: BalanceRepository,
    private readonly statementRepository: StatementRepository,
  ) {}

  static BATCH_TRANSACTION_FILE_EXTENSION = ".xlsx";

  async execute(
    {
      buffer,
      customer
    }: {
      buffer: Buffer,
      customer: RequestCustomer
    }): 
    Promise<any>
  {
    const wallet = await this.getCustomerWallet(customer.walletId);
    const fileData = this.fileReader.processFile({ file: buffer });
    await this.validateWalletBalance(wallet, fileData.totalValue);
    const queueData = this.mountQueueData();

    await this.createBatchTransactionHistory(wallet, queueData, fileData.transactions);
    await this.registerStatement(wallet, fileData.transactions, queueData.endToEndId);
    await this.removeWalletBalance(wallet, fileData.totalValue);

    const fileName = `${queueData.fileId}${CreateBatchTransactionService.BATCH_TRANSACTION_FILE_EXTENSION}`;
    await this.fileUploader.upload({ file: buffer, fileName });

    await this.batchTransactionQueue.connect();
    this.batchTransactionQueue.emit('BATCH_TRANSACTION_CREATED', queueData);
    return queueData;
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

  private mountQueueData(): BatchTransactionQueueData {
    const randonUuid = randomUUID();
    const fileId = randonUuid
    return {
      fileId,
      fileExtension: CreateBatchTransactionService.BATCH_TRANSACTION_FILE_EXTENSION,
      fileName: `${fileId}${CreateBatchTransactionService.BATCH_TRANSACTION_FILE_EXTENSION}`,
      endToEndId: randonUuid,
    };
  }

  private async createBatchTransactionHistory(
    wallet: Wallet,
    queueData: BatchTransactionQueueData,
    transactions: BatchTransactionFileRow[]
  ) {
    for(const transaction of transactions) {
      const batchTransactionHistory = this.batchTransactionHistoryRepository.create({
        endToEndId: queueData.endToEndId,
        fileId: queueData.fileId,
        wallet,
      });
      await this.batchTransactionHistoryRepository.save(batchTransactionHistory);
    }
  }

  private async removeWalletBalance(wallet: Wallet, amount: number): Promise<void> {
    const balanceId = wallet.balance.id as number;
    const currentBalance = wallet.balance.value;
    const newBalance = currentBalance - amount;
    await this.balanceRepository.update(balanceId, {
      value: newBalance
    });
  }

  private async registerStatement(wallet: Wallet, transactions: BatchTransactionFileRow[], endToEndId: string): Promise<void> {
    for(const transaction of transactions) {
      const statement = this.statementRepository.create({
        wallet,
        value: transaction.value,
        status: TrasactionStatus.PENDING,
        endToEndId,
        pixKey: transaction.pixKey,
      });
      await this.statementRepository.save(statement);
    }
    }
}
