import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { UsersModule } from './module/users/users.module';
require('dotenv').config({ path: `./.env` });

const MONGO_DB = process.env.MONGO_DB;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

console.log(MONGO_DB, MONGO_USER, MONGO_PASSWORD);

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.m6uw9.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;

@Module({
  imports: [MongooseModule.forRoot(uri), UsersModule],
  providers: [AppService],
})
export class AppModule {}
