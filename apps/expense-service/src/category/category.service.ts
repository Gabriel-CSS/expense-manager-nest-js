import { Injectable } from '@nestjs/common';
import { ResponseCategoryDto } from './dto/response-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async findAll(): Promise<ResponseCategoryDto[]> {
    const categories = await this.categoryRepository
      .createQueryBuilder('categories')
      .where('categories.status = :status', { status: true })
      .select(['categories.id', 'categories.name', 'categories.status'])
      .getMany();

    return categories.map((category) => {
      const responseCategoryDto = new ResponseCategoryDto();
      responseCategoryDto.id = category.id;
      responseCategoryDto.name = category.name;
      responseCategoryDto.status = category.status;
      return responseCategoryDto;
    });
  }
}
