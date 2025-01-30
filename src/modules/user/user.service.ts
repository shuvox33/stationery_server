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

// const getSingleUserFromDB = async (userId: JwtPayload) => {
//   const singleUser = await User.findById(userId);
//   return singleUser;
// };

export const UserService = {
  createUserToDB,
  getAllUserFromDB,
  // getSingleUserFromDB,
};
