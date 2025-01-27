import { z } from 'zod';

const updateOrderValidation = z.object({
  status: z.string().optional(),
});

export const OrderValidation = {
  updateOrderValidation,
};
