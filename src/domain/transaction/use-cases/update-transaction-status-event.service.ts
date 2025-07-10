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
import { UpdateTransactionStatusEvent } from "../interfaces/update-transaction-status-event.interface";
import { TransactionHistoryRepository } from "src/infra/repositories/transaction-history.repository";
import { Statement } from "src/infra/entities/transaction/statement.entity";
import { Balance } from "src/infra/entities/transaction/balance.entity";
import { TransactionHistory } from "src/infra/entities/transaction/transaction-history.entity";
import { BatchTransactionHistory } from "src/infra/entities/transaction/batch-transaction-history.entity";

@Injectable()
export class UpdateTransactionStatusEventService {
  constructor(
    private readonly transactionHistoryRepository: TransactionHistoryRepository,
    private readonly batchTransactionHistoryRepository: BatchTransactionHistoryRepository,
    private readonly statementRepository: StatementRepository,
    private readonly balanceRepository: BalanceRepository,
  ) {}

  async execute(data: UpdateTransactionStatusEvent): Promise<void> {
    const { endToEndId, status } = data;
    const statement = await this.statementRepository.findOneBy({ endToEndId });
    if (!statement || typeof statement.id === 'undefined') {
      throw new BadRequestException(`Statement not found for endToEndId: ${endToEndId}`);
    }
    await this.statementRepository.update(statement.id, { status });
    
    if(this.isFailedTransaction(status)) {
      await this.handleFailedTransaction(endToEndId);
    }
    if(this.isSuccessfullTransaction(status)) {
      await this.handleSuccessfullTransaction(endToEndId);
    }
  }

  private isFailedTransaction(status: TrasactionStatus) {
    if(status == TrasactionStatus.CANCELLED || status == TrasactionStatus.FAILED) return true;
    return false;
  }

  private isSuccessfullTransaction(status: TrasactionStatus) {
    console.log('status dentro', status);
    if(status == TrasactionStatus.DONE) return true;
    return false;
  }

  private async handleFailedTransaction(endToEndId: string) {
    const statement = await this.statementRepository.findOne({
      where: { endToEndId },
      relations: ['wallet']
    }) as Statement;

    const transactionHistory = await this.transactionHistoryRepository
      .findOneBy({ endToEndId }) as TransactionHistory;
    if(transactionHistory) {
      await this.transactionHistoryRepository.update({ endToEndId }, { authorized: false });
    }

    const batchTransactionHistory = await this.batchTransactionHistoryRepository
      .findOneBy({ endToEndId }) as BatchTransactionHistory;
    if(batchTransactionHistory) {
      await this.batchTransactionHistoryRepository.update({ endToEndId }, { authorized: false });
    }

    const wallet = statement.wallet;
    const balance = await this.balanceRepository.findOneBy({ wallet: { id: wallet.id } }) as Balance;

    const currentBalance = balance.value as number;
    const balanceId = balance.id as number;
    const updatedBalance = Number(currentBalance) + Number(statement.value);

    await this.balanceRepository.update(balanceId, { value: updatedBalance });
  }

  private async handleSuccessfullTransaction(endToEndId: string) {
    const transactionHistory = await this.transactionHistoryRepository
      .findOneBy({ endToEndId }) as TransactionHistory;
    if(transactionHistory) {
      await this.transactionHistoryRepository.update({ endToEndId }, { authorized: true });
    }

    const batchTransactionHistory = await this.batchTransactionHistoryRepository
      .findOneBy({ endToEndId }) as BatchTransactionHistory;
    if(batchTransactionHistory) {
      await this.batchTransactionHistoryRepository.update({ endToEndId }, { authorized: true });
    }
  }

}
