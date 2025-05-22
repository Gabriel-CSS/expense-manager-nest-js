import { ApiProperty } from '@nestjs/swagger';

export class ResponseCategoryDto {
  @ApiProperty({
    description: 'Id da Categoria',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da Categoria',
  })
  name: string;

  @ApiProperty({
    description: 'Status da Categoria',
  })
  status: boolean;
}
