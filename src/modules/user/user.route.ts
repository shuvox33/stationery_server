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

router.get('/:id', UserControllers.getSingleUser);

router.put(
  '/:id',
  auth(USER_ROLES.admin),
  //   validateRequest(UserValidation.userValidationSchema),
  UserControllers.updateUserBlock,
);

router.patch(
  '/update/:id',
  auth(USER_ROLES.admin, USER_ROLES.user),
  UserControllers.updateUserDetails,
);

export const userRoutes = router;
