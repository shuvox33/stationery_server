import { ZodError } from 'zod';
import { ErrorRequestHandler } from 'express';
import AppError from '../error/AppError';
import config from '../config';
import { TErrorSource } from '../interface/globalInterface';
import handleValidationError from '../error/handleValidationError';
import handleCastError from '../error/handleCastError';
import handleZodError from '../error/handleZodError';


const globalErrorHandler: ErrorRequestHandler = (errors, req, res, next) => {
  let statusCode = 500;
  let message = 'Something went wrong';

  let error: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  // checking there it's zod error or validation error
  if (errors instanceof ZodError) {
    const simplifiedError = handleZodError(errors);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    error = simplifiedError?.errorSource;
  } 
   if (errors?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(errors);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    error = simplifiedError?.errorSource;
  }
  else if (errors?.name === 'CastError') {
    const simplifiedError = handleCastError(errors);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    error = simplifiedError?.errorSource;
  } else if (errors instanceof AppError) {
    statusCode = errors?.statusCode;
    message = errors?.message;
    error = [
      {
        path: '',
        message: errors?.message,
      },
    ];
  } else if (errors instanceof Error) {
    message = errors?.message;
    error = [
      {
        path: '',
        message: errors?.message,
      },
    ];
  }

  // sending response
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    error,
    stack: config.nodeEnv === 'development' ? errors?.stack : null,
  });
  next();
};

export default globalErrorHandler;
