import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Category } from '../category/entities/category.entity';
import { RabbitMqClientModule } from '../rabbitmq/rabbitmq-client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Expense]),
    RabbitMqClientModule,
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule { }