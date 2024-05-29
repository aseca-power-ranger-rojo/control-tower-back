import { BadRequestException, BodyValidation, db } from '@utils';
import { Request, Response, Router } from 'express'
import { OrdersService } from '../service';
import { OrdersRepository } from '../repository';
import httpStatus from 'http-status';
import { GetOrderDTO, CreateOrderDTO, Steps } from '../dto';
import { Status } from '@prisma/client';

export const ordersController = Router();

const service: OrdersService = new OrdersService(new OrdersRepository(db))

ordersController.get('/', async(req: Request, res: Response) => {
  const orders: GetOrderDTO[] = await service.getOrders();
  return res.status(httpStatus.OK).json(orders);
});
  
ordersController.post('/', BodyValidation(CreateOrderDTO),  async(req: Request, res: Response) => {
  const data = req.body;
  await service.createOrder(data);
  return res.status(httpStatus.CREATED).json();
});

ordersController.patch('/:orderId/:step/:status', async(req: Request, res: Response) => {
  const { orderId, step, status } = req.params;

  const stepEnum = (Steps as any)[step.toUpperCase()]
  const statusEnum = (Status as any)[status.toUpperCase()]
  
  if (stepEnum === undefined) {
    throw new BadRequestException('Invalid step');
  }
  if (statusEnum === undefined) {
    throw new BadRequestException('Invalid status');
  }

  await service.updateOrder(orderId, stepEnum, statusEnum);
  return res.status(httpStatus.OK).json();
});