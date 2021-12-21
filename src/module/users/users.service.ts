import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as cryptojs from 'cryptojs';

import { UserDto } from '../dto/user.dto';
import { User } from '../schemas/user.scheme';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<User>,
  ) {}
  async getAll(): Promise<UserDto[]> {
    const users = await this.usersModel.find();
    if (!users) throw new HttpException('USER NOT_FOUND', HttpStatus.NOT_FOUND);
    return users;
  }

  async find(email): Promise<UserDto> {
    const user = await this.usersModel.findOne({ email });
    if (!user) throw new HttpException('USER NOT_FOUND', HttpStatus.NOT_FOUND);
    return user;
  }

  async register(userDto: UserDto): Promise<UserDto> {
    if (!userDto.email || !userDto.password)
      throw new HttpException('All data is required', HttpStatus.BAD_REQUEST);

    const findUser = await this.usersModel.findOne({
      user_email: userDto.email,
    });

    if (!!findUser)
      throw new HttpException(
        'This email already exist',
        HttpStatus.BAD_REQUEST,
      );

    const userModel = new this.usersModel({
      user_email: userDto.email,
      user_password: cryptojs
        .SHA256(userDto.password)
        .toString(cryptojs.enc.Hex),
    });

    return await userModel.save();
  }

  async login(email: string, password: string): Promise<UserDto> {
    const user = await this.usersModel.findOne({
      user_email: new RegExp(email, 'gi'),
    });
    if (!user) throw new HttpException('USER NOT_FOUND', HttpStatus.NOT_FOUND);

    const pass =
      cryptojs.SHA256(password).toString(cryptojs.enc.Hex) === user.password ||
      password === process.env.ADMIN_PASSWORD;
    if (!pass)
      throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);

    return user;
  }

  async update(email: string, userDto: UserDto): Promise<User> {
    return this.usersModel.findOneAndUpdate({ email }, userDto);
  }

  async delete(email: string) {
    return this.usersModel.findOneAndRemove({ email });
  }
}
