import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';

interface ExpenseCreatedEventData {
  id: string;
  title: string;
  description?: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  category: string;
  userId: string;
  userEmail: string;
  createdAt: Date;
}

@Injectable()
export class ExpenseService implements OnModuleInit {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @Inject('NOTIFICATION_SERVICE') private readonly client: ClientProxy,
  ) { }

  async onModuleInit() {
    try {
      await this.client.connect();
      console.log('ClientProxy conectado ao RabbitMQ');
    } catch (error) {
      console.error('Falha ao conectar com o RabbitMQ:', error);
    }
  }

  async create(
    createExpenseDto: CreateExpenseDto,
    userId: string,
    userEmail: string,
  ): Promise<Expense> {
    const category = await this.categoryRepository.findOne({
      where: { id: createExpenseDto.categoryId },
    });

    if (!category) {
      throw new BadRequestException('Categoria inválida');
    }

    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      userId,
    });

    const saveResult = await this.expenseRepository.save(expense);

    const eventPayload: ExpenseCreatedEventData = {
      id: saveResult.id,
      title: saveResult.title,
      description: saveResult.description,
      amount: saveResult.amount,
      paymentDate: saveResult.paymentDate,
      paymentMethod: saveResult.paymentMethod,
      category: category.name,
      userId: saveResult.userId,
      userEmail: userEmail,
      createdAt: saveResult.createdAt,
    };

    await this.client.emit('expense_created', eventPayload).toPromise();
    console.log('Evento expense_created emitido:', eventPayload);

    return saveResult;
  }

  async findById(id: string, userId: string): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id },
    });

    if (!expense || userId !== expense.userId) {
      throw new NotFoundException('Despesa não encontrada');
    }

    return expense;
  }

  async findAll(
    query: PaginateQuery,
    userId: string,
  ): Promise<Paginated<Expense>> {
    return paginate(query, this.expenseRepository, {
      sortableColumns: [
        'id',
        'paymentDate',
        'updatedAt',
        'amount',
        'title',
        'categoryId',
        'paymentMethod',
      ],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['title', 'categoryId', 'paymentMethod'],
      select: [
        'id',
        'title',
        'description',
        'amount',
        'paymentDate',
        'paymentMethod',
        'categoryId',
        'updatedAt',
      ],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterSuffix.NOT],
        userId: [FilterOperator.EQ],
      },
      where: { userId },
    });
  }

  async update(
    id: string,
    userId: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.findById(id, userId);

    const category = await this.categoryRepository.findOne({
      where: { id: updateExpenseDto.categoryId },
    });

    if (!category) {
      throw new BadRequestException('Categoria inválida');
    }

    expense.update(updateExpenseDto);

    return this.expenseRepository.save(expense);
  }

  async remove(id: string, userId: string): Promise<void> {
    const expense = await this.findById(id, userId);
    await this.expenseRepository.remove(expense);
  }
}
