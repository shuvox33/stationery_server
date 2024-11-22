import Joi from 'joi';

export const productValidationSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'any.required': 'Name is required',
    'string.empty': 'Name cannot be empty',
  }),
  brand: Joi.string().trim().required().messages({
    'any.required': 'Brand is required',
    'string.empty': 'Brand cannot be empty',
  }),
  price: Joi.number().positive().required().messages({
    'any.required': 'Price is required',
    'number.positive': 'Price must be a positive number',
  }),
  category: Joi.string()
    .valid(
      'Writing',
      'Office Supplies',
      'Art Supplies',
      'Educational',
      'Technology',
    )
    .required(),
    
  description: Joi.string().optional(),
  quantity: Joi.number().integer().min(0).required().messages({
    'any.required': 'Quantity is required',
    'number.base': 'Quantity must be a number',
    'number.min': 'Quantity must be a positive number',
  }),
  inStock: Joi.boolean().required().messages({
    'any.required': 'In stock is required',
  }),
  image: Joi.string().uri().optional().messages({
    'string.uri': 'Image must be a valid URI',
  }),
});

export default productValidationSchema;
