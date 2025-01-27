import { Application, Router } from 'express';
import { OrderController } from './order.controller';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../user/user.constant';

const router = Router();

router.post(
  '/',
  auth(USER_ROLES.user),
  OrderController.createOrder as Application,
);
router.get(
  '/revenue',
  auth(USER_ROLES.admin, USER_ROLES.user),
  OrderController.getRevinue as Application,
);

router.get(
  '/',
  auth(USER_ROLES.admin, USER_ROLES.user),
  OrderController.getAllOrders as Application,
);

export const OrderRoute = router;
