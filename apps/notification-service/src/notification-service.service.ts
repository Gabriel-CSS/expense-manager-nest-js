import { Controller, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { Channel, ConsumeMessage } from 'amqplib';

interface ExpenseCreatedEvent {
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

@Controller()
export class NotificationServiceService {
  private readonly logger = new Logger(NotificationServiceService.name);

  constructor(private readonly mailerService: MailerService) { }

  @EventPattern('expense_created')
  async handleExpenseCreated(
    @Payload() data: ExpenseCreatedEvent,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    this.logger.log('Recebido evento expense_created');
    this.logger.debug(`Dados do evento: ${JSON.stringify(data)}`);

    try {
      await this.sendExpenseNotification(data);
      this.logger.log('Email de notificação enviado com sucesso');

      const channel = context.getChannelRef() as unknown as Channel;
      const originalMsg = context.getMessage() as unknown as ConsumeMessage;

      channel.ack(originalMsg);
      this.logger.log('Mensagem confirmada com sucesso');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      this.logger.error(`Erro ao processar evento: ${errorMessage}`);

      const channel = context.getChannelRef() as unknown as Channel;
      const originalMsg = context.getMessage() as unknown as ConsumeMessage;

      channel.nack(originalMsg);
      this.logger.log('Mensagem rejeitada');

      throw error;
    }
  }

  private async sendExpenseNotification(
    data: ExpenseCreatedEvent,
  ): Promise<void> {
    const message = `
      Nova despesa registrada:
      
      Título: ${data.title}
      ${data.description ? `Descrição: ${data.description}` : ''}
      Valor: R$ ${data.amount.toFixed(2)}
      Data de Pagamento: ${new Date(data.paymentDate).toLocaleDateString('pt-BR')}
      Forma de Pagamento: ${data.paymentMethod}
      Categoria: ${data.category}
      
      Para mais detalhes, acesse sua conta.
    `;

    await this.mailerService.sendMail({
      to: data.userEmail,
      subject: 'Nova Despesa Registrada',
      text: message,
    });
  }
}
