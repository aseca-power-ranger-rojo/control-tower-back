import { Order, PrismaClient, Status } from "@prisma/client";
import { CreateOrderDTO, GetOrderDTO } from "../dto";

export class OrdersRepository {
    constructor(private readonly db: PrismaClient) {}

    async getOrders(): Promise<GetOrderDTO[]> {
        const orders = await this.db.order.findMany({
            where: {
                NOT: {
                    pickingStatus: Status.COMPLETED,
                    deliveryStatus: Status.COMPLETED
                }
            },
            select: {
                id: true,
                orderId: true,
                pickingStatus: true,
                deliveryStatus: true
            }
        });
        return orders.map(order => new GetOrderDTO(order));
    }

    async createOrder(data: CreateOrderDTO): Promise<Order> {
        return await this.db.order.create({
            data: {
                ...data,
            },
        });
    }

    async updateOrder(orderId: string, data: {pickingId?: string, pickingStatus?: Status, deliveryId?: string, deliveryStatus?: Status}): Promise<Order> {
        return await this.db.order.update({
            where: {
                orderId: orderId
            },
            data: {
                ...data
            }
        });
    }

}