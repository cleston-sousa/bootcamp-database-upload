import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const { income } = await this.createQueryBuilder('t')
      .select('SUM(t.value)', 'income')
      .where('t.type = :type', { type: 'income' })
      .getRawOne();

    const { outcome } = await this.createQueryBuilder('t')
      .select('SUM(t.value)', 'outcome')
      .where('t.type = :type', { type: 'outcome' })
      .getRawOne();
    return {
      income: parseInt(income, 10),
      outcome: parseInt(outcome, 10),
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
