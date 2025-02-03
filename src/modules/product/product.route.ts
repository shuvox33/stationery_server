import { RequestHandler, Router } from 'express';
import { ProductController } from './product.controller';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../user/user.constant';
import { multerUpload } from '../../../src/config/multer.config';

const router = Router();

router.post(
  '/create',
  auth(USER_ROLES.admin),
  multerUpload.single('image'),
  ProductController.createProduct as RequestHandler,
);
router.get(
  '/',
  // auth(USER_ROLES.admin),
  ProductController.getAllProducts as RequestHandler,
);
router.get(
  '/:productId',
  // auth(USER_ROLES.admin),
  ProductController.getSingleProduct as RequestHandler,
);
router.put(
  '/:productId',
  auth(USER_ROLES.admin),
  multerUpload.single('image'),
  ProductController.updateProduct as RequestHandler,
);
router.delete(
  '/:productId',
  auth(USER_ROLES.admin),
  ProductController.deletedProduct as RequestHandler,
);

export const ProductRoute = router;
