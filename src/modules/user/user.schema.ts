import { z } from 'zod';

const userValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Enter your full name',
      })
      .min(3)
      .max(30),
    image: z.string().optional().default(''),
    email: z
      .string({
        required_error: 'email is required ',
      })
      .email(),
    password: z
      .string({
        required_error: 'password is required',
      })
      .min(6, { message: 'Password must be at least 6 characters' }),
    role: z.enum(['admin', 'user']).optional(),
    isBlocked: z.boolean().optional(),
  }),
});

export const UserValidation = {
  userValidationSchema,
};
