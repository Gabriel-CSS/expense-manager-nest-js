import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import { Expense } from './entities/expense.entity';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@ApiTags('expenses')
@ApiBearerAuth()
@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) { }

  @Post()
  @ApiOperation({ summary: 'Cadastrar uma nova despesa' })
  @ApiResponse({ status: 201, description: 'Despesa cadastrada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return this.expenseService.create(
      createExpenseDto,
      req.user.id,
      req.user.email,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma despesa por ID' })
  @ApiResponse({ status: 200, description: 'Despesa encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Despesa não encontrada' })
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.expenseService.findById(id, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar despesas com paginação' })
  @ApiResponse({ status: 200, description: 'Lista de despesas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll(
    @Paginate() query: PaginateQuery,
    @Request() req: AuthenticatedRequest,
  ): Promise<Paginated<Expense>> {
    return this.expenseService.findAll(query, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma despesa' })
  @ApiResponse({ status: 200, description: 'Despesa atualizada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Despesa não encontrada' })
  async update(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expenseService.update(id, req.user.id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma despesa' })
  @ApiResponse({ status: 200, description: 'Despesa removida com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Despesa não encontrada' })
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.expenseService.remove(id, req.user.id);
  }
}
