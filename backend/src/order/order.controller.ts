import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateTicketDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.orderService.createOrder(createTicketDto);
  }
}
