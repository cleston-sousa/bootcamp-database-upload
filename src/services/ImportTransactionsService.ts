import Transaction from '../models/Transaction';

import CreateTransactionService from './CreateTransactionService';

import readCVSFile from '../utils/readCVSFile';

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const lines = await readCVSFile(filename);

    const createTransactionService = new CreateTransactionService();

    const result: Transaction[] = new Array<Transaction>();

    for (let index = 0; index < lines.length; index++) {
      const item = lines[index];

      const newTransaction = await createTransactionService.execute({
        title: item[0],
        type: item[1],
        value: item[2],
        category: item[3],
      });
      result.push(newTransaction);
    }

    return result;
  }
}

export default ImportTransactionsService;
