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

const getSingleUserFromDB = async (id: string) => {
  const singleUser = await User.findById(id);
  return singleUser;
};

export const UserService = {
  createUserToDB,
  getAllUserFromDB,
  getSingleUserFromDB,
};
