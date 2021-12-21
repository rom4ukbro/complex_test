import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../dto/user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Users not found.',
  })
  async getAll() {
    return await this.usersService.getAll();
  }

  @Get('find')
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found.',
  })
  @ApiQuery({ name: 'email' })
  async find(@Query('email') email: string) {
    return await this.usersService.find(email);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: UserDto })
  async createUser(@Body() userDto: UserDto) {
    const user = await this.usersService.register(userDto);
    if (!!user) return true;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UserDto })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unathorized',
  })
  async login(@Body() userDto: UserDto): Promise<UserDto> {
    return await this.usersService.login(userDto.email, userDto.password);
  }

  @Put('update')
  @ApiQuery({ name: 'email' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated',
    type: UserDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found.',
  })
  async updateUser(@Query('email') email: string, @Body() authorDto: UserDto) {
    return this.usersService.update(email, authorDto);
  }

  @Delete('delete')
  @ApiQuery({ name: 'email' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted',
    type: UserDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found.',
  })
  async deleteAuthor(@Query('email') email: string) {
    return this.usersService.delete(email);
  }
}
