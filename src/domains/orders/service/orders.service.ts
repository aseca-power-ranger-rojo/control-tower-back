import axios from "axios";
import { CreateOrderDTO, GetOrderDTO, Steps, Order } from "../dto";
import { OrdersRepository } from "../repository";
import { Status } from "@prisma/client";
import { BadRequestException, NotFoundException } from "@utils";

const pickingServiceUrl = process.env.PICKING_SERVICE_URL + '/api/orders';
const deliveryServiceUrl = process.env.DELIVERY_SERVICE_URL + '/api/orders';

export class OrdersService {
  constructor(private readonly repository: OrdersRepository) {}

  async getOrders(): Promise<GetOrderDTO[]> {
    return await this.repository.getOrders();
  }

  async createOrder(data: CreateOrderDTO): Promise<Order> {
    const order = await this.repository.createOrder(data);
    const picking = await axios.post(pickingServiceUrl, {
      orderId: data.orderId  
    })
    await this.repository.updateOrder(order.orderId, {
      pickingId: picking.data.id,
      pickingStatus: Status.PENDING
    })

    return order;
  }

  async updateOrder(orderId: string, step: Steps, status: Status): Promise<Order> {
    const stepStatus = step.toLowerCase() + 'Status';
    const data = {
      [stepStatus]: status
    }

    let order: Order = await this.getOrder(orderId);
    switch(status) {
      case Status.PENDING:
        if (order[stepStatus] != Status.BLOCKED) throw new BadRequestException('order status is not blocked');
        break
      case Status.IN_PROGRESS:
        if (order[stepStatus] != Status.PENDING) throw new BadRequestException('order status is not pending');
        break
      case Status.COMPLETED:
        if (order[stepStatus] != Status.IN_PROGRESS) throw new BadRequestException('order status is not in progress');
        break
      default:
        throw new BadRequestException('Invalid status');
    }
    order = await this.repository.updateOrder(orderId, data);
    if (step === Steps.PICKING && status === Status.COMPLETED) {

      const delivery = await axios.post( deliveryServiceUrl, {
        orderId: orderId,
      })

      order = await this.repository.updateOrder(orderId, {
        deliveryId: delivery.data.id,
        deliveryStatus: Status.PENDING
      });
    }

    return order;
  }

  async getOrder(orderId: string): Promise<Order> {
    const order: Order|null = await this.repository.getOrder(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

}