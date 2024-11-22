import { model, Schema } from 'mongoose';
import { IOrder } from './order.model';

const orderSchema = new Schema<IOrder>({
  email: {
    type: String,
    required: true,
    trim: true,
    message: 'Email is required',
  },
  product: {
    type: Object,
    required: true,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    required: true,
  },
});

export const Order = model<IOrder>('Order', orderSchema);
