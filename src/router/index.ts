import { Router } from 'express'
import { ordersController } from '@domains/orders'

export const router = Router()

router.use('/orders', ordersController);