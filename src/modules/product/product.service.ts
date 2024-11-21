import { IProduct } from './product.model';
import { ProductModel } from './product.schema';

const createProductToDB = async (product: IProduct) => {
  const createdProduct = await ProductModel.create(product);
  return createdProduct;
};

export const ProductService = {
  createProductToDB,
};
