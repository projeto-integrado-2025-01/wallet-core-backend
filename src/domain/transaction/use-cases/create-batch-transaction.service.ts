import { BatchTransactionHistoryRepository } from "src/infra/repositories/batch-transaction-history.repository";
import { WalletRepository } from "src/infra/repositories/wallet.repository";
import { AwsS3FileStorage } from "src/infra/gateways/aws-s3-file-storage";
import { XlsxFileReader } from "src/infra/gateways/xlsx-file-reader";
import { Wallet } from "src/infra/entities/transaction/wallet.entity";

import { randomUUID } from 'crypto';
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { BatchTransactionQueueData } from "../interfaces/batch-transaction-queue-data";
import { BatchTransactionFileRow } from "../interfaces/batch-transaction-file-row";
import { RequestCustomer } from "src/domain/auth/interfaces/request-customer";

@Injectable()
export class CreateBatchTransactionService {
  constructor(
    @Inject("BATCH_TRANSACTION_SERVICE")
    private readonly batchTransactionQueue: ClientProxy,
    private readonly fileUploader: AwsS3FileStorage,
    private readonly fileReader: XlsxFileReader,
    private readonly walletRepository: WalletRepository,
    private readonly batchTransactionHistoryRepository: BatchTransactionHistoryRepository, 
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
    const userId = 1;
    const wallet = await this.getCustomerWallet(userId);
    const fileData = this.fileReader.processFile({ file: buffer });
    await this.validateWalletBalance(userId, fileData.totalValue);
    const queueData = this.mountQueueData();

    const batchTransactionHistory = await this.createBatchTransactionHistory(wallet, queueData, fileData.transactions);

    const fileName = `${queueData.fileId}${CreateBatchTransactionService.BATCH_TRANSACTION_FILE_EXTENSION}`;
    await this.fileUploader.upload({ file: buffer, fileName });

    await this.batchTransactionQueue.connect();
    this.batchTransactionQueue.emit('BATCH_TRANSACTION_CREATED', queueData);
    return queueData;
  }

  private async getCustomerWallet(userId: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findWalletByCustomerId(userId);
    if (!wallet) {
      throw new BadRequestException("Carteira não encontrada para o usuário.");
    }
    return wallet;
  }

  private async validateWalletBalance(userId: number, amount: number): Promise<void> {
    if(amount > 1000) {
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
}
