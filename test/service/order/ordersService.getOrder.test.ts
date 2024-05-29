import { OrdersService } from '@domains/orders/service';
import { OrdersRepository } from '@domains/orders/repository';
import { db } from '@utils';

describe('OrdersService.getOrders', () => {
    let service: OrdersService;
    let repo: OrdersRepository;

    beforeEach(() => {
        repo = new OrdersRepository(db);
        service = new OrdersService(repo);
    });

    it('test_001 should return an empty list when there are no orders', async () => {
        jest.spyOn(repo, 'getOrders').mockResolvedValue([]);

        const orders = await service.getOrders();

        expect(orders).toEqual([]);
        expect(repo.getOrders).toHaveBeenCalled();
    });
});
