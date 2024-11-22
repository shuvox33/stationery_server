import { RequestHandler, Router } from 'express';
import { ProductController } from './product.controller';

const router = Router();

router.post('/', ProductController.createProduct as RequestHandler);
router.get('/', ProductController.getAllProducts as RequestHandler);
router.get('/:productId', ProductController.getSingleProduct as RequestHandler);
router.put('/:productId', ProductController.updateProduct as RequestHandler);
router.delete(
  '/:productId',
  ProductController.deletedProduct as RequestHandler,
);

export const ProductRoute = router;
