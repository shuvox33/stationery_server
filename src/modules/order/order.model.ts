import { Types } from 'mongoose';

export type IOrder = {
  email: string;
  product: Types.ObjectId | string;
  user: Types.ObjectId | string;
  quantity: number;
  totalPrice: number;
  status: 'Pending' | 'Shipping' | 'Delivered' | 'Cancelled';
  payment_status: 'Pending' | 'Paid' | 'Failed' | 'Cancelled';
  transaction: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
};
