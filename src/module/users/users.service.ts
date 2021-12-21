import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as cryptojs from 'crypto-js';

import { UserDto } from '../dto/user.dto';
import { User } from '../schemas/user.scheme';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<User>,
  ) {}
  async getAll(): Promise<UserDto[]> {
    const users = await this.usersModel.find().select('-password -__v -_id');
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
      email: userDto.email,
    });

    if (!!findUser)
      throw new HttpException(
        'This email already exist',
        HttpStatus.BAD_REQUEST,
      );

    const userModel = new this.usersModel({
      email: userDto.email,
      password: cryptojs.SHA256(userDto.password).toString(cryptojs.enc.Hex),
    });

    return await userModel.save();
  }

  async login(email: string, password: string): Promise<UserDto> {
    const user = await this.usersModel.findOne({
      email: new RegExp(email, 'gi'),
      password: cryptojs.SHA256(password).toString(cryptojs.enc.Hex),
    });
    if (!user) throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);

    delete user.password;
    delete user.__v;
    delete user._id;

    return user;
  }

  async update(email: string, userDto: UserDto): Promise<User> {
    userDto.password
      ? (userDto.password = cryptojs
          .SHA256(userDto.password)
          .toString(cryptojs.enc.Hex))
      : 0;

    const user = await this.usersModel
      .findOneAndUpdate({ email }, { ...userDto, update_at: new Date() })
      .select('-password -__v -_id');
    return user;
  }

  async delete(email: string): Promise<Boolean> {
    const user = await this.usersModel.deleteOne({ email });
    if (!user.deletedCount) return false;
    return true;
  }
}
