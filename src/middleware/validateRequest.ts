import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
    });
    next();
  });
};

export default validateRequest;
