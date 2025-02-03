// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Product } from './../product/product.schema';
import { Order } from './order.schema';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';
import { orderUtils } from './order.utils';
import QueryBuilder from '../builder/Querybuilder';
import { orderSearchableFields } from './order.constant';
import { VerificationResponse } from 'shurjopay';

interface OrderData {
  product: string;
  quantity: number;
  totalPrice?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

const createOrderToDB = async (
  orderData: OrderData,
  userId: string,
  client_ip: string,
) => {
  const {
    product,
    quantity,
    totalPrice,
    name,
    email,
    phone,
    address,
    city,
    postalCode,
  } = orderData;

  // Validate user and product
  if (!userId) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  const foundProduct = await Product.findById(product);
  if (!foundProduct) {
    throw new AppError('Product not found', StatusCodes.NOT_FOUND);
  }

  // Check product availability
  if (!foundProduct?.inStock || foundProduct?.quantity < quantity) {
    throw new AppError('Product is not available', StatusCodes.BAD_REQUEST);
  }

  // Update product quantity
  await Product.findByIdAndUpdate(foundProduct._id, {
    $inc: { quantity: -quantity },
  });

  // Update product inStock status
  const updatedProduct = await Product.findById(foundProduct._id);
  if (updatedProduct?.quantity === 0) {
    await Product.findByIdAndUpdate(foundProduct._id, {
      $set: { inStock: false },
    });
  }

  // Calculate total price
  const calculatedTotalPrice = (foundProduct.price as number) * quantity;
  const finalTotalPrice = totalPrice ?? calculatedTotalPrice;

  // Create the order in the database
  const order = await Order.create({
    user: userId,
    product,
    quantity,
    totalPrice: finalTotalPrice,
    name,
    email,
    phone,
    address,
    city,
    postalCode,
    status: 'Pending',
    payment_status: 'Pending',
    transaction: {
      id: '',
      transactionStatus: '',
    },
  });

  // payment gateway integration shurjopay
  const shurjopayPayload = {
    amount: finalTotalPrice,
    order_id: order._id,
    currency: 'BDT',
    customer_name: name,
    customer_email: order.email,
    customer_phone: phone,
    customer_address: address,
    customer_city: city,
    customer_post_code: postalCode,
    client_ip,
  };

  const payment = await orderUtils.makePaymentAsyn(shurjopayPayload);

  // Update transaction details in the order
  if (payment?.transactionStatus) {
    await Order.updateOne(
      { _id: order._id },
      {
        $set: {
          'transaction.id': payment.sp_order_id,
          'transaction.transactionStatus': payment.transactionStatus,
        },
      },
    );
  }

  return {
    checkout_url: payment?.checkout_url,
  };
};

// verifyPayment shurjopay
const verifyPayment = async (
  order_id: string,
): Promise<VerificationResponse[]> => {
  const verifyPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifyPayment.length) {
    await Order.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifyPayment[0].bank_status,
        'transaction.sp_code': verifyPayment[0].sp_code,
        'transaction.sp_message': verifyPayment[0].sp_message,
        'transaction.transactionStatus': verifyPayment[0].transactionStatus,
        'transaction.method': verifyPayment[0].method,
        'transaction.date_time': verifyPayment[0].date_time,
        payment_status:
          verifyPayment[0].bank_status === 'Success'
            ? 'Paid'
            : verifyPayment[0].bank_status === 'Failed'
              ? 'Pending'
              : verifyPayment[0].bank_status === 'Cancel'
                ? 'Cancelled'
                : 'Pending',
      },
    );
  }

  return verifyPayment;
};

// updatePaymentStatus function
const updatePaymentStatus = async (transaction_id: string, status: string) => {
  const result = await Order.updateOne(
    { transaction: transaction_id },
    { payment_status: status },
    { new: true },
  );
  console.log(`Payment status updated to ${status} for order ${orderId}`);
  return result;
};

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

const getAllOrdersFromDB = async (query: any) => {
  const orderQuery = new QueryBuilder(Order.find(), query)
    .search(orderSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.modelQuery;
  const meta = await orderQuery.countTotal();

  return {
    result,
    meta,
  };
};

const getSingleOrderFromDB = async (id: string) => {
  const result = await Order.findById(id).populate('product').populate('user');
  return result;
};

const updateOrderToDB = async (orderId: string, status: string) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', StatusCodes.NOT_FOUND);
  }
  const product = order.product;
  if (status === 'Cancelled' && product && typeof product !== 'string') {
    await Product.findByIdAndUpdate(product._id, {
      $inc: { quantity: order.quantity },
      inStock: true,
    });
  }

  const result = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true },
  );

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



const getMyOrdersFromDB = async (userId: string) => {
  const result = await Order.find({ user: userId }).populate('product').populate('user');
  return result;
}




export const OrderService = {
  createOrderToDB,
  getRevinueFromDB,
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  updateOrderToDB,
  deleteOrderFromDB,
  updatePaymentStatus,
  verifyPayment,
  getMyOrdersFromDB,
};
