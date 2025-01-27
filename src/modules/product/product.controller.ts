import { ProductService } from './product.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { Product } from './product.schema';

const createProduct = catchAsync(async (req, res) => {
  const { ...data } = req.body;
  const result = await ProductService.createProductToDB(data);

  const products = await Product.findById(result._id);
  if (!products) {
    return sendResponse(res, {
      statusCode: StatusCodes.NOT_FOUND,
      success: false,
      message: 'Product not found',
      data: {},
    });
  }

  // check if product is available or not
  // if (!products?.inStock || products?.quantity < 1) {
  //   return sendResponse(res, {
  //     statusCode: StatusCodes.BAD_REQUEST,
  //     success: false,
  //     message: 'Product is not available or insufficient quantity',
  //     data: {},
  //   });
  // }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

// get all products by search term  :
const getAllProducts = catchAsync(async (req, res) => {
  const { searchTerm } = req.query;
  const result = await ProductService.getAllProductsFromDB(
    searchTerm as string,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Products retrieved successfully',
    data: result,
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
  const data = req.body;
  const result = await ProductService.updateProductById(productId, data);

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
