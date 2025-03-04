import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../error/AppError';
import { StatusCodes } from 'http-status-codes';
import config from '../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError('You are not authorized', StatusCodes.UNAUTHORIZED);
    }

    // checking token is valid or not :
    const decoded = jwt.verify(token, config.jwtAccessTokenSecret as string);

    const { error, role, email } = decoded as JwtPayload;
    if (error) {
      throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
