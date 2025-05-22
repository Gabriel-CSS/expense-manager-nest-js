import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@exemplo.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Papel do usuário (role)',
    example: 'user',
    default: 'user',
    required: false,
  })
  @IsString()
  @IsOptional()
  role?: string;
}
