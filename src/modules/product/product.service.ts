import { IProduct } from './product.model';
import { Product } from './product.schema';

const createProductToDB = async (product: IProduct) => {
  const createdProduct = await Product.create(product);

  return createdProduct;
};

const getAllProductsFromDB = async () => {
  const products = await Product.find();
  return products;
};

// get single product by id :
const getSingleProductById = async (id: string) => {
  const product = await Product.findById(id);
  return product;
};

// update product :
const updateProductById = async (id: string, payload: Partial<IProduct>) => {
  const updatedProduct = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    updatedAt: new Date(),
  });
  console.log('updatedProduct', updatedProduct);
  return updatedProduct;
};

// delete product :
const deleteProductById = async (id: string) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    return deletedProduct;
  } catch (error) {
    console.log(error);
  }
};

export const ProductService = {
  createProductToDB,
  getAllProductsFromDB,
  getSingleProductById,
  updateProductById,
  deleteProductById,
};
