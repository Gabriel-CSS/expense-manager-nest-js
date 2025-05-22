import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UpdateExpenseDto } from '../dto/update-expense.dto';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  paymentDate: Date;

  @Column({
    type: 'enum',
    enum: ['Dinheiro', 'Cartão de Crédito', 'Pix', 'Boleto', 'Transferência'],
  })
  paymentMethod: string;

  @Column()
  categoryId: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public update(updateDto: UpdateExpenseDto) {
    this.title = updateDto.title!;
    this.description = updateDto.description!;
    this.amount = updateDto.amount!;
    this.paymentDate = updateDto.paymentDate!;
    this.paymentMethod = updateDto.paymentMethod!;
    this.categoryId = updateDto.categoryId!;
  }
}
