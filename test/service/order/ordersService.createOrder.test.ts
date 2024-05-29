import axios from 'axios';
import { OrdersService } from '@domains/orders/service';
import { OrdersRepository } from '@domains/orders/repository';
import { db } from '@utils';
import { CreateOrderDTO } from '@domains/orders/dto';
import { Status, Order } from '@prisma/client';

describe('OrdersService.createOrder', () => {
    let service: OrdersService;
    let repo: OrdersRepository;

    beforeEach(() => {
        repo = new OrdersRepository(db);
        service = new OrdersService(repo);
    });

    it('test_001 should create an order and return it', async () => {
        const order: CreateOrderDTO = { orderId: "1" };
        const mockOrder = { id: "2", orderId: "1", pickingId: "3", pickingStatus: Status.IN_PROGRESS } as Order;
        const mockPicking = { data: { id: "3" } };

        jest.spyOn(repo, 'createOrder').mockResolvedValue(mockOrder);
        jest.spyOn(repo, 'updateOrder').mockResolvedValue(mockOrder);
        jest.spyOn(axios, 'post').mockResolvedValue(mockPicking);

        const result = await service.createOrder(order);

        expect(result).toEqual(mockOrder);
        expect(axios.post).toHaveBeenCalled();
        expect(repo.createOrder).toHaveBeenCalledWith(order);
        expect(repo.updateOrder).toHaveBeenCalledWith(mockOrder.orderId, {
            pickingId: mockPicking.data.id,
            pickingStatus: Status.PENDING
        });
    });
});
