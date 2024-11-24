import { Product } from '../product/product.schema';
import { Order } from './order.schema';
import { IOrder } from './order.model';
import { Response } from 'express';

const createOrderToDB = async (orderData: IOrder, res: Response) => {
  const { email, product, quantity, totalPrice } = orderData;
  const foundProduct = await Product.findById(product);

  // check if product is available or not
  if (!foundProduct?.inStock || foundProduct?.quantity < quantity) {
    return res.status(400).json({
      status: 'false',
      message: 'Product is not available or insufficient quantity',
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
    product: foundProduct._id,
    quantity,
    totalPrice: finalTotalPrice,
  });

  return order;
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

export const OrderService = {
  createOrderToDB,
  getRevinueFromDB,
};
