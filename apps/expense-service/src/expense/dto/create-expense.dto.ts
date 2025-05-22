import {
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
  IsPositive,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../enums/payment-method.enum';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Título da despesa',
    example: 'Médico...',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: 'Descrição da despesa',
    example: 'Médico no dia X, pago no PIX.',
    required: false,
  })
  @IsString()
  @MinLength(3)
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Valor da despesa',
    example: 200.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Data de pagamento da despesa',
    example: '2025-04-28T18:35:00Z',
  })
  @IsDateString()
  paymentDate: Date;

  @ApiProperty({
    description: 'Forma de pagamento',
    example: PaymentMethod.PIX,
    enum: PaymentMethod,
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Categoria da despesa',
    example: '5a51f0a2-79b4-4c6a-9f5b-b5ad9cfd6cf7',
  })
  @IsString()
  categoryId: string;
}
