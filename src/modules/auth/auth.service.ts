import { StatusCodes } from 'http-status-codes';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import AppError from '../../error/AppError';
import { createToken } from './auth.utils';
import config from '../../config';

const loginUserInDB = async (payload: TLoginUser) => {
  const user = await User.isUserExist(payload.email);
  if (!user) {
    throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);
  }

  if (!(await User.isPasswordMatched(payload.password, user.password))) {
    throw new AppError('Password is incorrect', StatusCodes.UNAUTHORIZED);
  }

  // create token and send it to user
  const JwtPayload = {
    email: user.email,
    role: user.role,
    userId: user._id.toString(),
  };

  // create access token
  const token = createToken(
    JwtPayload,
    config.jwtAccessTokenExpiresIn as string,
    config.jwtAccessTokenSecret as string,
  );

  return {
    token,
  };
};

export const authService = {
  loginUserInDB,
};
