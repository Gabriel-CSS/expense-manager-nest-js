import {
  Controller,
  Get,
  Patch,
  Body,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('me')
  @ApiOperation({ summary: 'Obter dados do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário retornados com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getProfile(@Request() req: AuthenticatedRequest) {
    return this.userService.findById(req.user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualizar dados do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Remover conta do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Conta removida com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async removeProfile(@Request() req: AuthenticatedRequest) {
    return this.userService.remove(req.user.id);
  }
}
