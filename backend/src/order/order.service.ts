import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from 'src/films/entities/film.entity';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

  async createOrder(createOrderDto: CreateTicketDto) {
    const ticketsArray = createOrderDto.tickets;

    ticketsArray.map(async (ticket) => {
      const filmDate = await this.filmModel
        .findOne({
          id: ticket.film,
        })
        .exec();

      const numberHall = filmDate.schedule.findIndex((index) => {
        return index.id === ticket.session;
      });

      if (numberHall >= 0) {
        if (
          filmDate.schedule[numberHall].taken.indexOf(
            `${ticket.row}:${ticket.seat}`,
          ) === -1
        ) {
          filmDate.schedule[numberHall].taken.push(
            `${ticket.row}:${ticket.seat}`,
          );

          await this.filmModel.updateOne(
            { id: ticket.film },
            { $set: { schedule: filmDate.schedule } },
          );
        }
      }
    });
    return {
      total: ticketsArray.length,
      items: ticketsArray,
    };
  }
}
