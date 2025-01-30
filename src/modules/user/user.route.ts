import { Router } from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middleware/auth';
import { USER_ROLES } from './user.constant';

const router = Router();

router.post(
  '/create',
  //   validateRequest(UserValidation.userValidationSchema),
  UserControllers.createUser,
);

router.get('/', UserControllers.getAllUser);

router.put(
  '/:id',
  auth(USER_ROLES.admin),
  //   validateRequest(UserValidation.userValidationSchema),
  UserControllers.updateUserBlock,
);

export const userRoutes = router;
