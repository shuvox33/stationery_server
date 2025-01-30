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

// router.get(
//   '/login-user',
//   auth(USER_ROLES.user, USER_ROLES.admin),
//   UserControllers.getSingleUser,
// );

export const userRoutes = router;
