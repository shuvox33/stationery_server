import { Router } from 'express';
import { ProductController } from './product.controller';

const router = Router();

router.post('/', ProductController.createProduct);

export const ProductRoute = router;
