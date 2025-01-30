import { model, Schema } from 'mongoose';
import { IProduct } from './product.model';

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true, 
      trim: true,
      message: 'Name is required',
    },
    brand: {
      type: String,
      required: true,  
      trim: true,
      message: 'Brand is required',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: (v: number) => v > 0,
        message: 'Price must be a positive number',
      },
    },
    category: {
      type: String,
      enum: [
        'Writing',
        'Office Supplies',
        'Art Supplies',
        'Educational',
        'Technology',
      ],
      required: true,
      message: 'Category is required',
    },
    author: {
      type: String,
      // required: true,
      ref: 'User',
      message: 'Author is required',
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      message: 'Quantity must be a positive number',
    },
    inStock: {
      type: Boolean,
      required: true,
      default : true,
      message: 'In stock is required',
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Product = model<IProduct>('Product', productSchema);
