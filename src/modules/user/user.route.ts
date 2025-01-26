import { Router } from 'express';
import { UserControllers } from './user.controller';

const router = Router();

router.post(
  '/create',
  //   validateRequest(UserValidation.userValidationSchema),
  UserControllers.createUser,
);

router.get(
  '/',
  UserControllers.getAllUser,
);

router.get(
  '/:id',
  UserControllers.getSingleUser,
);

export const userRoutes = router;