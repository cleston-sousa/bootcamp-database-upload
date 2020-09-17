import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance();

      if (balance.total < value) {
        throw new AppError('No balance', 400);
      }
    } else if (type !== 'income') {
      throw new AppError('Transaction not accepted', 400);
    }

    const categoriesRepository = getRepository(Category);

    let categoryEntity = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categoryEntity) {
      categoryEntity = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(categoryEntity);
    }

    const resultTransaction = transactionsRepository.create({
      title,
      value,
      type,
      category: categoryEntity,
    });

    await transactionsRepository.save(resultTransaction);

    return resultTransaction;
  }
}

export default CreateTransactionService;
