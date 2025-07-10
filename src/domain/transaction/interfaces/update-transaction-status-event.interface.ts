import { TrasactionStatus } from "../enums/transaction-status.enum";

export interface UpdateTransactionStatusEvent {
  endToEndId: string;
  status: TrasactionStatus;
}
