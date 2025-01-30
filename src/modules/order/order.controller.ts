import { OrderService } from './order.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

const createOrder = catchAsync(async (req, res) => {
  const orderData = req.body;
  const { userId } = req.user;
  // console.log('userId', req.user);
  const result = await OrderService.createOrderToDB(
    orderData,
    res,
    userId,
    req.ip!,
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

// verify payment from shurjopay
const verifyPayment = catchAsync(async (req, res): Promise<any> => {
  console.log('req.query', req.query);

  const order_id = req.query.order_id as string;

  // Validate if order_id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(order_id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Order ID----------->',
    });
  }

  const order = await OrderService.verifyPayment(order_id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment verified successfully',
    data: order,
  });
});

// const verifyPayment = catchAsync(async (req, res): Promise<any> => {
//   console.log('req.query', req.query);
//   console.log('order_id', req.query.order_id);

//   if (!mongoose.Types.ObjectId.isValid(req.query.order_id as string)) {
//     return res.status(400).json({
//       success: false,
//       message: 'Invalid order ID',
//     });
//   }

//   const order = await OrderService.verifyPayment(req.query.order_id as string);

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Payment verified successfully',
//     data: order,
//   });
// });

// get total revenue from db :
const getRevinue = catchAsync(async (req, res) => {
  const result = await OrderService.getRevinueFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Revenue calculated successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const result = await OrderService.getAllOrdersFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All Orders get successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const result = await OrderService.getSingleOrderFromDB(orderId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order fetched successfully',
    data: result,
  });
});

const updateOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const {status} = req.body;
  const result = await OrderService.updateOrderToDB(orderId, status);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order updated successfully',
    data: result,
  });
});

const deletedOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  await OrderService.deleteOrderFromDB(orderId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order deleted successfully',
    data: {},
  });
});

export const OrderController = {
  createOrder,
  getRevinue,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deletedOrder,
  verifyPayment,
};
