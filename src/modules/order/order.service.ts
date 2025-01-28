import { Product } from './../product/product.schema';
import { Order } from './order.schema';
import { IOrder } from './order.model';
import { Response } from 'express';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';
import { orderUtils } from './order.utils';

const createOrderToDB = async (
  orderData: IOrder,
  res: Response,
  userId: string,
  client_ip: string,
) => {
  const { email, product, quantity, totalPrice } = orderData;

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

  // payment gateway integration
  const shurjopayPayload = {
    amount: finalTotalPrice,
    order_id: order._id,
    currency: 'BDT',
    customer_name: 'N/A',
    customer_email: 'N/A',
    customer_phone: 'N/A',
    customer_address: 'N/A',
    customer_city: 'N/A',
    client_ip,
  };

  // makePayment
  const payment = await orderUtils.makePayment(shurjopayPayload);

  return {
    order: await order.populate('product'),
    payment,
  };
};

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    console.log('verifiedPayment', verifiedPayment);
    await Order.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Pending'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'Cancelled'
                : '',
      },
      { new: true },
    );
  }

  return verifiedPayment;
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

  // update product quantity and inStock status if order is deleted
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
  verifyPayment,
};
