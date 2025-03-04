import mongoose, { model, Schema } from 'mongoose';
import { IMessage } from './message.interface';

const messageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Message = model<IMessage>('Message', messageSchema);
