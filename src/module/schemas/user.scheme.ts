import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ require: true, default: new Date() })
  created_at: Date;

  @Prop({ require: true, default: new Date() })
  update_at: Date;

  @Prop({ require: true, unique: true })
  email: string;

  @Prop({ require: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
