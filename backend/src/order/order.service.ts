import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateTicketDto } from './dto/order.dto';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async createOrder(createOrderDto: CreateTicketDto) {
    const ticketsArray = createOrderDto.tickets;
    let items = [];

    for (const ticket of ticketsArray) {
      const filmDate = await this.scheduleRepository.findOne({
        where: {
          id: ticket.session,
        },
      });

      if (!filmDate) {
        throw new Error(`Film with id ${ticket.film} not found`);
      }

      const place = `${ticket.row}:${ticket.seat}`;

      if (filmDate.taken == '') {
        filmDate.taken = place;
      } else {
        filmDate.taken = `${filmDate.taken}, ${place}`;
      }

      await this.scheduleRepository.save(filmDate);

      items = [...items, filmDate];
    }
    return { total: items.length, items: items };
  }
}
