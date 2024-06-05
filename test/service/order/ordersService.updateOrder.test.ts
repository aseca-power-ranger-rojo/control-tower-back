import { OrdersService } from '@domains/orders/service';
import { OrdersRepository } from '@domains/orders/repository';
import { db } from '@utils';
import { Steps } from '@domains/orders/dto';
import { Status, Order } from '@prisma/client';
import axios from "axios";

describe('OrdersService.updateOrder', () => {
    let service: OrdersService;
    let repo: OrdersRepository;

    beforeEach(() => {
        repo = new OrdersRepository(db);
        service = new OrdersService(repo);
    });

    it('test_001 should update an order with the given step and status', async () => {
        const orderId = "1";
        const step = Steps.DELIVERY;
        const status = Status.COMPLETED;
        const mockOrder = { id: "2", orderId: "1", deliveryStatus: Status.IN_PROGRESS } as Order;
        const mockUpdatedOrder = { id: "2", orderId: "1", deliveryStatus: Status.COMPLETED } as Order;

        jest.spyOn(repo, 'getOrder').mockResolvedValue(mockOrder)
        jest.spyOn(repo, 'updateOrder').mockResolvedValue(mockUpdatedOrder);

        const result = await service.updateOrder(orderId, step, status);

        expect(result.deliveryStatus).toEqual(status);
        expect(repo.updateOrder).toHaveBeenCalledWith(orderId, {
            [`${step.toLowerCase()}Status`]: status
        });
    });
    it('test_002 should update an order and create a delivery when step is PICKING', async () => {
        const orderId = "1";
        const step = Steps.PICKING;
        const status = Status.COMPLETED;
        const mockOrder = { id: "2", orderId: "1", pickingStatus: Status.IN_PROGRESS } as Order;
        const mockUpdatedOrder = {
            id: "2", orderId: "1", pickingStatus: Status.COMPLETED, deliveryId: "3", deliveryStatus: Status.PENDING
        } as Order;
        const mockDelivery = { data: { id: "3" } };

        jest.spyOn(repo, 'getOrder').mockResolvedValue(mockOrder)
        jest.spyOn(repo, 'updateOrder').mockResolvedValue(mockUpdatedOrder);
        jest.spyOn(axios, 'post').mockResolvedValue(mockDelivery);

        const result = await service.updateOrder(orderId, step, status);

        expect(result.pickingStatus).toEqual(status);
        expect(axios.post).toHaveBeenCalled();
        expect(repo.updateOrder).toHaveBeenCalledWith(orderId, {
            deliveryId: mockDelivery.data.id,
            deliveryStatus: Status.PENDING
        });
        expect(result.deliveryStatus).toEqual(Status.PENDING);
    });
});

