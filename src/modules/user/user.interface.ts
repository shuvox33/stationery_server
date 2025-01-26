import { Model } from 'mongoose';
import { USER_ROLES } from './user.constant';

export interface TUser {
  _id: string;
  name: string;
  imgae?: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isBlocked: boolean;
}

export interface UserModel extends Model<TUser> {
  isPasswordMatched(password: string, hashedPassword: string): Promise<boolean>;
  isUserExist(email: string): Promise<TUser>;
}

export type TUserRole = keyof typeof USER_ROLES;
