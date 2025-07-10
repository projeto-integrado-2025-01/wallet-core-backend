import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { TransactionHistoryRepository } from 'src/infra/repositories/transaction-history.repository';
import { StatementRepository } from 'src/infra/repositories/statement.repository';
import { TrasactionStatus } from 'src/domain/transaction/enums/transaction-status.enum';
import { UpdateTransactionStatusEventService } from 'src/domain/transaction/use-cases/update-transaction-status-event.service';
import { UpdateTransactionStatusEvent } from 'src/domain/transaction/interfaces/update-transaction-status-event.interface';


@Controller()
export class TransactionConsumerController {
  constructor(
    private readonly updateTransactionStatusEventService: UpdateTransactionStatusEventService,
    private readonly statementRepository: StatementRepository,
    private readonly transactionHistoryRepository: TransactionHistoryRepository,
  ) {}

  @EventPattern('TRANSACTION_STATUS_UPDATED')
  async handleTransactionUpdated(
    @Payload() data: UpdateTransactionStatusEvent,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.updateTransactionStatusEventService.execute(data);
      channel.ack(originalMsg);
    } catch (error) {
      channel.nack(originalMsg, false, false);
    }
  }
}