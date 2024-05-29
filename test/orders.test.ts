import axios from 'axios';
import { OrdersService } from '@domains/orders/service';
import { OrdersRepository } from '@domains/orders/repository';
import { db } from '@utils';
import { CreateOrderDTO, Steps } from '@domains/orders/dto';
import { Status, Order } from '@prisma/client';

describe('OrdersService', () => {
  let service: OrdersService;
  let repo: OrdersRepository;

  beforeEach(() => {
    repo = new OrdersRepository(db);
    service = new OrdersService(repo);
  });

  it('should get orders', async () => {

    const repoSpy = jest.spyOn(repo, 'getOrders').mockResolvedValue([]);

    const orders = await service.getOrders();

    expect(orders).toEqual([]);
    expect(repoSpy).toHaveBeenCalled();
  });
  
  it('should create an order', async () => {
    const order: CreateOrderDTO = { orderId: "1" };

    const mockOrder = {id: "2", orderId: "1", pickingId: "3", pickingStatus: Status.IN_PROGRESS} as Order;
    const mockPicking = { data: { id: "3" } };

    const repoCreateSpy = jest.spyOn(repo, 'createOrder').mockResolvedValue(mockOrder);
    const repoUpdateSpy = jest.spyOn(repo, 'updateOrder').mockResolvedValue(mockOrder);
    const axiosSpy = jest.spyOn(axios, 'post').mockResolvedValue(mockPicking);

    const result = await service.createOrder(order);

    expect(result).toEqual(mockOrder);
    expect(axiosSpy).toHaveBeenCalled();
    expect(repoCreateSpy).toHaveBeenCalledWith(order);
    expect(repoUpdateSpy).toHaveBeenCalledWith(mockOrder.orderId, {
      pickingId: mockPicking.data.id,
      pickingStatus: Status.PENDING
    });
  });
  
  it('should update an order', async () => {
    const orderId = "1";
    const step = Steps.DELIVERY;
    const status = Status.COMPLETED;

    const mockOrder = {id: "2", orderId: "1", deliveryStatus: Status.COMPLETED} as Order;

    const repoSpy = jest.spyOn(repo, 'updateOrder').mockResolvedValue(mockOrder);

    const result = await service.updateOrder(orderId, step, status);

    expect(result.deliveryStatus).toEqual(status);
    expect(repoSpy).toHaveBeenCalledWith(orderId, {
      [`${step.toLowerCase()}Status`]: status
    });
  });

  it('should update an order and create a delivery', async () => {
    const orderId = "1";
    const step = Steps.PICKING;
    const status = Status.COMPLETED;

    const mockOrder = {id: "2", orderId: "1", pickingStatus: Status.COMPLETED, deliveryId: "3", deliveryStatus: Status.PENDING} as Order;
    const mockDelivery = { data: { id: "3" } };

    const repoUpdateSpy = jest.spyOn(repo, 'updateOrder').mockResolvedValue(mockOrder);
    const axiosSpy = jest.spyOn(axios, 'post').mockResolvedValue(mockDelivery);

    const result = await service.updateOrder(orderId, step, status);

    expect(result.pickingStatus).toEqual(status);
    expect(axiosSpy).toHaveBeenCalled();
    expect(repoUpdateSpy).toHaveBeenCalledWith(orderId, {
      deliveryId: mockDelivery.data.id,
      deliveryStatus: Status.PENDING
    });
    expect(result.deliveryStatus).toEqual(Status.PENDING);
  });

});