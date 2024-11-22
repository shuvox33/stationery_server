import { z } from 'zod';

const productSchemaZod = z.object({
  name: z.string().min(3, 'Name is required').trim(),
  brand: z.string().min(3, 'Brand is required').trim(),
  price: z.number().nonnegative('Price must be a positive number'),
  category: z.enum([
    'Writing',
    'Office Supplies',
    'Art Supplies',
    'Educational',
    'Technology',
  ]),
  description: z.string().optional(),
  quantity: z.number().nonnegative('Quantity must be a positive number'),
  inStock: z.boolean(),
  image: z.string().optional(),
});

export const ProductValidation = {
  productSchemaZod,
};

