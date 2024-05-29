import axios from "axios";
import { CreateOrderDTO, GetOrderDTO, Steps } from "../dto";
import { OrdersRepository } from "../repository";
import { Order, Status } from "@prisma/client";

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
    const data = {
      [`${step.toLowerCase()}Status`]: status
    }
    let order = await this.repository.updateOrder(orderId, data);
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

}