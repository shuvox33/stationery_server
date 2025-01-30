import { JwtPayload } from 'jsonwebtoken';
import { TUser } from './user.interface';
import { User } from './user.model';

const createUserToDB = async (payload: TUser) => {
  const createdUser = await User.create(payload);
  return createdUser;
};

const getAllUserFromDB = async () => {
  const allUser = await User.find({});
  return allUser;
};

const updateUserInDB = async (id: string, isBlocked: boolean) => {
  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    { isBlocked: true },
    {
      new: true,
    },
  );
  return updatedUser;
};

export const UserService = {
  createUserToDB,
  getAllUserFromDB,
  updateUserInDB,
};
