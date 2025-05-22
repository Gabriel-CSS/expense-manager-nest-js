import { Controller, Get, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get()
  @ApiOperation({ summary: 'Lista de Categorias' })
  @ApiResponse({ status: 200, description: 'Categorias' })
  findAll() {
    return this.categoryService.findAll();
  }
}
