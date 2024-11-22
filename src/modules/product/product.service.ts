import { IProduct } from './product.model';
import { Product } from './product.schema';

//TODO-1 : create product ------- :
const createProductToDB = async (product: IProduct) => {
  const createdProduct = await Product.create(product);
  return createdProduct;
};

//TODO-2 : get all products by search term ------- :
const getAllProductsFromDB = async (searchTerm?: string) => {
  let searchFilter = {};

  if (searchTerm) {
    searchFilter = {
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { brand: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } },
      ],
    };
  }
  const result = await Product.find(searchFilter);
  return result;
};

//TODO-3 : get single product by id ------- :
const getSingleProductById = async (id: string) => {
  const product = await Product.findById(id);
  return product;
};

//TODO-4 : update product ------- :
const updateProductById = async (id: string, payload: Partial<IProduct>) => {
  const updatedProduct = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    updatedAt: new Date(),
  });
  return updatedProduct;
};

//TODO-5 : delete product :
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
