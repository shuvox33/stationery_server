import { Request, Response } from 'express';
import { ProductService } from './product.service';

const createProduct = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    const result = await ProductService.createProductToDB(data);

    return res.status(200).json({
      status: 'success',
      message: 'Product created successfully',
      data: result,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Validation failed',
      error: error,
    });
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const result = await ProductService.getAllProductsFromDB();

    return res.status(200).json({
      status: 'success',
      message: 'Products retrieved successfully',
      data: result,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get products',
      error: error,
    });
  }
};

const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const result = await ProductService.getSingleProductById(productId);

    return res.status(200).json({
      status: 'success',
      message: 'Product retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get product',
      error: error,
    });
  }
};

// update product :
const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const data = req.body;

    const result = await ProductService.updateProductById(productId, data);

    return res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update product',
      error: error,
    });
  }
};

// delete product :
const deletedProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const result = await ProductService.deleteProductById(productId);

    return res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete product',
      error: error,
    });
  }
};

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deletedProduct,
};
