import bcrypt from 'bcrypt';
import { TUser } from './user.interface';
import { User } from './user.model';
import config from '../../config';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';

const createUserToDB = async (payload: TUser) => {
  const isUserExist = await User.isUserExist(payload.email);
  if (isUserExist) {
    throw new AppError('User already exist', StatusCodes.CONFLICT);
  }

  const createdUser = await User.create(payload);
  return createdUser;
};

const getAllUserFromDB = async () => {
  const allUser = await User.find({});
  return allUser;
};

const getSingleUserFromDB = async (id: string) => {
  const singleUser = await User.findOne({ _id: id });
  return singleUser;
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

const updateUserDetails = async (id: string, data: Partial<TUser>) => {
  // Check if the password is being updated
  if (data.password) {
    data.password = await bcrypt.hash(
      data.password,
      Number(config.bcryptSaltRounds),
    );
  }

  const updatedUser = await User.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });

  return updatedUser;
};

export const UserService = {
  createUserToDB,
  getAllUserFromDB,
  updateUserInDB,
  getSingleUserFromDB,
  updateUserDetails,
};
