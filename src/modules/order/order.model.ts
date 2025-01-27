import { Types } from 'mongoose';

export type IOrder = {
  email: string;
  product: Types.ObjectId | string;
  user: Types.ObjectId | string;
  quantity: number;
  totalPrice: number;
  status: 'Pending' | 'Shipping' | 'Delivered' | 'Cancelled';
};
