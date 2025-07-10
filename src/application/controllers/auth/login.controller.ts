import { LoginService } from 'src/domain/auth/use-cases/login.service';
import { LoginDto } from './dtos/login.dto';

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Customer login',
    description:
      'This endpoint is responsible for authentication a customer.',
  })
  @ApiOkResponse({
    description: 'Login success',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - invalid authentication',
  })
  async handle(
    @Body() loginDto: LoginDto,
  ): Promise<any> {
    return this.loginService.execute(loginDto);
  }
}