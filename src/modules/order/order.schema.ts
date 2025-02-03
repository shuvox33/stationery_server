import { model, Schema } from 'mongoose';
import { IOrder } from './order.model';
import validator from 'validator';

const orderSchema = new Schema<IOrder>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      message: 'Email is required',
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'Invalid email address',
      },
    },
    product: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Shipping', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    payment_status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Cancelled'],
      default: 'Pending',
    },
    transaction: {
      id: String,
      transactionStatus: String,
      bank_status: String,
      sp_code: String,
      sp_message: String,
      method: String,
      date_time: String,
    },
  },
  { timestamps: true },
);

export const Order = model<IOrder>('Order', orderSchema);
