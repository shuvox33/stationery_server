import { Product } from '../product/product.schema';
import { Order } from './order.schema';
import { IOrder } from './order.model';
import { Response } from 'express';

const createOrderToDB = async (orderData: IOrder, res: Response) => {
  const { email, product, quantity, totalPrice } = orderData;
  const foundProduct = await Product.findById(product);

  //! check if product is available or not to create order this error is not fixed yet
  if (!foundProduct) {
    return res.status(400).json({
      status: 'false',
      message: 'Product not found',
    });
  }

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
    $set: { inStock: false },
  });

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

export const OrderService = {
  createOrderToDB,
};
