import { OrderService } from './order.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createOrder = catchAsync(async (req, res) => {
  const orderData = req.body;
  const { userId } = req.user;

  const result = await OrderService.createOrderToDB(orderData, userId, req.ip!);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const order = await OrderService.verifyPayment(req.query.order_id as string);

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
  const result = await OrderService.getAllOrdersFromDB(req.query);
  // console.log(result);

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
  const { status } = req.body;
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


const getMyOrders = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await OrderService.getMyOrdersFromDB(userId);


  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Your orders received successfully',
    data: result,
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
  getMyOrders,
};
