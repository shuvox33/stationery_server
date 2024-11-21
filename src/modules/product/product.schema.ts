import { model, Schema } from 'mongoose';
import { IProduct } from './product.model';

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price must be a positive number'],
      min: 0,
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
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity must be a positive number'],
      min: 0,
    },
    inStock: {
      type: Boolean,
      required: [true, 'In stock is required'],
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

export const ProductModel = model<IProduct>('Product', productSchema);
