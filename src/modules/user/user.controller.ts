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

const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.getSingleUserFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});

const updateUserBlock = catchAsync(async (req, res) => {

  const { id } = req.params;

  const { isBlocked } = req.body;
  console.log(isBlocked);
  const result = await UserService.updateUserInDB(id, isBlocked);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User blocked successfully',
    data: result,
  });
});

const updateUserDetails = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await UserService.updateUserDetails(id, data);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User details updated successfully',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getSingleUser,
  getAllUser,
  updateUserBlock,
  updateUserDetails,
};
