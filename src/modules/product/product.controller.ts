import { ProductService } from './product.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { Product } from './product.schema';
import AppError from '../../error/AppError';

const createProduct = catchAsync(async (req, res) => {
  const { userId } = req.user;
  console.log( 'this is req.body',req.body);

  let productData;
  try {
    if (!req.body.data) {
      throw new AppError('Missing product data', StatusCodes.BAD_REQUEST);
    }
    productData = JSON.parse(req.body.data);
  } catch (error) {
    throw new AppError('Invalid product data', StatusCodes.BAD_REQUEST);
  }

  const result = await ProductService.createProductToDB(
    {
      ...productData,
      image: req.file?.path,
    },
    userId,
  );

  const products = await Product.findById(result._id);
  if (!products) {
    throw new AppError('Product not found', StatusCodes.NOT_FOUND);
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

// get all products by search term  :
const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductService.getAllProductsFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Products retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

// get single product by id :
const getSingleProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ProductService.getSingleProductById(productId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

// update product :
const updateProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  let productData;
  try {
    if (!req.body.data) {
      throw new AppError('Missing product data', StatusCodes.BAD_REQUEST);
    }
    productData = JSON.parse(req.body.data);
  } catch (error) {
    throw new AppError('Invalid product data', StatusCodes.BAD_REQUEST);
  }

  // get image path
  const imagePath = req.file ? req.file.path : productData.image;

  const result = await ProductService.updateProductById(productId, {
    ...productData,
    image: imagePath,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

// delete product :
const deletedProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  await ProductService.deleteProductById(productId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product deleted successfully',
    data: {},
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deletedProduct,
};
