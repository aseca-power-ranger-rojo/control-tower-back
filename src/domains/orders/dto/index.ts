
import { Status } from "@prisma/client";
import { IsUUID, IsNotEmpty, IsOptional, IsNumber, IsArray, ValidateNested, IsDecimal } from "class-validator";
import { Order as OriginalOrder } from '@prisma/client'

export interface Order extends OriginalOrder {
    [key: string]: any
}

export class CreateOrderDTO {
    @IsUUID()
    @IsNotEmpty()
    orderId!: string;
}

export class GetOrderDTO {
    constructor(order: GetOrderDTO) {
        this.id = order.id;
        this.orderId = order.orderId;
        this.pickingStatus = order.pickingStatus;
        this.deliveryStatus = order.deliveryStatus;
    }

    id: string;
    orderId: string;
    pickingStatus: Status;
    deliveryStatus: Status;
}

export enum Steps {
    PICKING = 'PICKING',
    DELIVERY = 'DELIVERY'
}