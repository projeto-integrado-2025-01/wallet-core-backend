import { Injectable } from '@nestjs/common';
import { BatchTransactionFileRow } from 'src/domain/transaction/interfaces/batch-transaction-file-row';
import * as xlsx from 'xlsx';

@Injectable()
export class XlsxFileReader {
  processFile(
    { file }: {file: Buffer}
  ): { totalValue: number, transactions: BatchTransactionFileRow[] } 
  {
    const workbook = xlsx.read(file, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error("Nenhuma planilha encontrada no arquivo.");
    }

    const worksheet = workbook.Sheets[sheetName];
    const transactions: BatchTransactionFileRow[] = xlsx.utils.sheet_to_json(worksheet);
    if (transactions.length === 0) {
      throw new Error("O arquivo está vazio ou em formato incorreto.");
    }

    const requiredHeaders = ['pixKey', 'pixKeyType', 'value'];
    const firstRowHeaders = Object.keys(transactions[0]);
    const hasAllHeaders = requiredHeaders.every(header => firstRowHeaders.includes(header));
    if (!hasAllHeaders) {
      throw new Error(`O arquivo deve conter as colunas: ${requiredHeaders.join(', ')}.`);
    }

    const totalValue = transactions.reduce((sum, transaction) => {
      const value = Number(transaction.value);
      return sum + value;
    }, 0);

    return { totalValue, transactions };
  }
}
