// import { Model } from "mongoose";

export interface TUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isBlocked: boolean;
}

// export interface UseModel extends Model<TUser> {
//   isPasswordMatched(password: string, hashedPassword: string): Promise<boolean>;
//   isUserExist(email: string): Promise<TUser>;
// }