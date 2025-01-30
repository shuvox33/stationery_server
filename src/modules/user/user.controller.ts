import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUserToDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'User registered successfully',
    data: {
      _id: result._id,
      name: result.name,
      email: result.email,
    },
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserService.getAllUserFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All users fetched successfully',
    data: result,
  });
});

// const getSingleUser = catchAsync(async (req, res) => {
//   const { userId } = req.user;
//   console.log('user', req.user);
//   const result = await UserService.getSingleUserFromDB(userId);

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'User get successfully',
//     data: result,
//   });
// });

export const UserControllers = {
  createUser,
  getAllUser,
  // getSingleUser,
};
