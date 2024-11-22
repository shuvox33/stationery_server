import { RequestHandler, Router } from 'express';
import { ProductController } from './product.controller';

const router = Router();

// create product :
router.post('/', ProductController.createProduct as RequestHandler);
// get all products :
router.get('/', ProductController.getAllProducts as RequestHandler);
// get single product :
router.get('/:productId', ProductController.getSingleProduct as RequestHandler);

// update product :
router.put('/:productId', ProductController.updateProduct as RequestHandler);

// delete product :
router.delete(
  '/:productId',
  ProductController.deletedProduct as RequestHandler,
);

export const ProductRoute = router;
