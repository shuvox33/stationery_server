import mongoose from 'mongoose';

export interface IMessage {
  senderId: mongoose.Schema.Types.ObjectId;
  recieverId: mongoose.Schema.Types.ObjectId;
  text: string;
  image?: string;
}
