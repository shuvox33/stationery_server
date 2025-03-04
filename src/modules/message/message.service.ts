import AppError from '../../error/AppError';
import { IMessage } from '../message/message.interface';
import { Message } from '../message/message.schema';
import { StatusCodes } from 'http-status-codes';

const sendMessageInDB = async (payload: IMessage, userId: string) => {
  if (!userId) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }
  const result = await Message.create({
    ...payload,
    senderId: userId,
  });

  return result;
};

const getAllMessagesFromDB = async () => {
  const result = await Message.find({});
  return result;
};

const getMessagesFromDB = async (id: string, myId: string) => {
  const result = await Message.find({
    $or: [
      { senderId: myId, recieverId: id },
      { senderId: id, recieverId: myId },
    ],
  });

  return result;
};

const deleteMessageInDB = async (id: string) => {
  const result = await Message.findOneAndDelete({ _id: id });
  return result;
};

export const messageService = {
  sendMessageInDB,
  getAllMessagesFromDB,
  deleteMessageInDB,
  getMessagesFromDB,
};
