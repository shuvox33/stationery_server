import { Request, Response } from 'express';
import { OrderService } from './order.service';

const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    const result = await OrderService.createOrderToDB(orderData, res);

    return res.status(200).json({
      status: 'true',
      message: 'Order created successfully',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'false',
      message: 'Internal server error',
      error: error,
    });
  }
};

// get total revenue from db :
const getRevinue = async (req: Request, res: Response) => {
  try {
    const result = await OrderService.getRevinueFromDB();

    return res.status(200).json({
      status: 'true',
      message: 'Revenue calculated successfully',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'false',
      message: 'Internal server error',
      error: error,
    });
  }
};

export const OrderController = {
  createOrder,
  getRevinue,
};
