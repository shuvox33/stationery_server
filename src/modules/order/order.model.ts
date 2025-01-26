import { Types } from "mongoose";

export type IOrder = {
  email: string;
  product: Types.ObjectId | string;
  quantity: number;
  totalPrice: number;
};
