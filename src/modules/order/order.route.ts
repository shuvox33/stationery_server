import { Application, Router } from 'express';
import { OrderController } from './order.controller';

const router = Router();

router.post('/', OrderController.createOrder as Application);

export const OrderRoute = router;
