import AppError from '../../error/AppError';
import QueryBuilder from '../builder/Querybuilder';
import { productSearchableFields } from './product.constant';
import { IProduct } from './product.model';
import { Product } from './product.schema';
import { StatusCodes } from 'http-status-codes';

const createProductToDB = async (product: IProduct, userId: string) => {
  if (!userId) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  const createProduct = await Product.create({
    ...product,
    author: userId,
  });
  return createProduct;
};

const getAllProductsFromDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(Product.find(), query)
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();

  return {
    result,
    meta,
  };
};

const getSingleProductById = async (id: string) => {
  const product = await Product.findById(id);
  return product;
};

const updateProductById = async (id: string, payload: Partial<IProduct>) => {
  const updatedProduct = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    updatedAt: new Date(),
  });
  return updatedProduct;
};

const deleteProductById = async (id: string) => {
  const deletedProduct = await Product.findByIdAndDelete(id);
  return deletedProduct;
};

export const ProductService = {
  createProductToDB,
  getAllProductsFromDB,
  getSingleProductById,
  updateProductById,
  deleteProductById,
};
