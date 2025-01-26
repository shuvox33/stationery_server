import { Router } from 'express';
import { UserControllers } from './user.controller';

const router = Router();

router.post(
  '/create',
  //   validateRequest(UserValidation.userValidationSchema),
  UserControllers.createUser,
);

export const userRoutes = router;