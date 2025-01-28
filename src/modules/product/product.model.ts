import { Types } from "mongoose";

export type IProduct = {
  name: string;
  brand: string;
  price: number;
  category:
    | 'Writing'
    | 'Office Supplies'
    | 'Art Supplies'
    | 'Educational'
    | 'Technology';
  model: string;
  author : Types.ObjectId | string;
  description?: string;
  quantity: number;
  inStock: boolean;
  image?: string;
};
