import { Product } from './../product/product.schema';
import { Order } from './order.schema';
import { IOrder } from './order.model';
import { Response } from 'express';
import { User } from '../user/user.model';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';

const createOrderToDB = async (
  orderData: IOrder,
  res: Response,
  userId: string,
) => {
  const { email, product, quantity, totalPrice } = orderData;

  // const userData = await User.findById(user);
  // console.log(userData);

  if (!userId) {
    return res.status(404).json({
      status: 'false',
      message: 'User not found',
    });
  }

  const foundProduct = await Product.findById(product);
  if (!foundProduct) {
    return res.status(404).json({
      status: 'false',
      message: 'Product not found',
    });
  }

  // check if product is available or not
  if (!foundProduct?.inStock || foundProduct?.quantity < quantity) {
    return res.status(400).json({
      status: 'false',
      message: 'Product is not available',
    });
  }

  // update product quantity
  await Product.findByIdAndUpdate(foundProduct._id, {
    $inc: { quantity: -quantity },
  });

  // update product inStock status
  const updatedProduct = await Product.findById(foundProduct._id);
  if (updatedProduct?.quantity === 0) {
    await Product.findByIdAndUpdate(foundProduct._id, {
      $set: { inStock: false },
    });
  }

  await foundProduct.save();

  // calculate total price for the order
  const calculatedTotalPrice = (foundProduct.price as number) * quantity;
  const finalTotalPrice = totalPrice ?? calculatedTotalPrice;

  const order = await Order.create({
    email,
    product: { _id: foundProduct?._id, quantity },
    user: userId,
    quantity,
    totalPrice: finalTotalPrice,
  });

  return (await order.populate('product')).populate('user');
};

// get total revenue from db :
const getRevinueFromDB = async () => {
  const result = await Order.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    {
      $unwind: '$productDetails',
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: { $multiply: ['$quantity', '$productDetails.price'] },
        },
      },
    },
    { $project: { _id: 0, totalRevenue: 1 } },
  ]);
  return result;
};

const getAllOrdersFromDB = async () => {
  const result = await Order.find().populate('product').populate('user');
  return result;
};

const getSingleOrderFromDB = async (id: string) => {
  const result = await Order.findById(id).populate('product').populate('user');
  return result;
};

const updateOrderToDB = async (orderId: string, orderData: IOrder) => {
  const result = await Order.findByIdAndUpdate(orderId, orderData, {
    new: true,
  });
  return result;
};

const deleteOrderFromDB = async (orderId: string) => {
  const order = await Order.findById(orderId).populate('product');

  if (!order) {
    throw new AppError('Order not found', StatusCodes.NOT_FOUND);
  }
  const product = order.product;

  if (product && typeof product !== 'string') {
    await Product.findByIdAndUpdate(
      product._id,
      {
        $inc: { quantity: order.quantity },
        inStock: true,
      },
      { new: true },
    );
  }

  const result = await order.deleteOne();
  return result;
};

export const OrderService = {
  createOrderToDB,
  getRevinueFromDB,
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  updateOrderToDB,
  deleteOrderFromDB,
};
