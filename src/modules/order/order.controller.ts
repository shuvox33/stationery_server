import { OrderService } from './order.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

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
const verifyPayment = catchAsync(async (req, res) => {
  console.log('req.query', req.query);
  const { order_id } = req.query;

  // if (!order_id || typeof order_id !== 'string') {
  //   return sendResponse(res, {
  //     statusCode: StatusCodes.BAD_REQUEST,
  //     success: false,
  //     message: 'Invalid or Order id is missing',
  //     data: {},
  //   });
  // }

  const order = await OrderService.verifyPayment(order_id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment verified successfully',
    data: order,
  });
});

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
  const result = await OrderService.getAllOrdersFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All Orders successfully',
    data: result,
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
  const orderData = req.body;
  const result = await OrderService.updateOrderToDB(orderId, orderData);

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
