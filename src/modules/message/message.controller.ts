import AppError from '../../error/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { IMessage } from './message.interface';
import { messageService } from './message.service';
import { StatusCodes } from 'http-status-codes';

const sendMessage = catchAsync(async (req, res) => {
  const { userId } = req.user;
  let messageData: any = {};

  if (req.body.data) {
    try {
      messageData = JSON.parse(req.body.data); // Parse if `data` exists
    } catch (error) {
      throw new AppError('Invalid message data', StatusCodes.BAD_REQUEST);
    }
  } else {
    messageData = req.body; // Directly use req.body when no `data` field
  }

  if (!messageData?.recieverId) {
    throw new AppError('Missing message data', StatusCodes.BAD_REQUEST);
  }

  const messagePayload = {
    ...messageData,
    image: req.file?.path || null, // Ensure image is handled properly
  };

  const result = await messageService.sendMessageInDB(
    messagePayload as IMessage,
    userId,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});

const getAllMessages = catchAsync(async (req, res) => {
  const result = await messageService.getAllMessagesFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Messages retrieved successfully',
    data: result,
  });
});

const getMessages = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const result = await messageService.getMessagesFromDB(id, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message retrieved successfully',
    data: result,
  });
});

const deleteMessage = catchAsync(async (req, res) => {
  const { id } = req.params;
  await messageService.deleteMessageInDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message deleted successfully',
    data: null,
  });
});

export const messageController = {
  sendMessage,
  getAllMessages,
  getMessages,
  deleteMessage,
};
