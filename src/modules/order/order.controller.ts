import { OrderService } from './order.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createOrder = catchAsync(async (req, res) => {
  const orderData = req.body;
  const result = await OrderService.createOrderToDB(orderData, res);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Order created successfully',
    data: result,
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

export const OrderController = {
  createOrder,
  getRevinue,
};
