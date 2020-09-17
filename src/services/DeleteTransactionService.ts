import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const toDelete = await transactionsRepository.findOne(id);

    if (!toDelete) {
      throw new AppError('invalid transaction', 400);
    }

    await transactionsRepository.delete(toDelete.id);
  }
}

export default DeleteTransactionService;
