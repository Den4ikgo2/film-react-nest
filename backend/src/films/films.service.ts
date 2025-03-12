import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Film } from './entities/film.entity';
import { Model } from 'mongoose';

@Injectable()
export class FilmsService {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

  async getAllFilms() {
    const data = await this.filmModel.find().select('-schedule -_id').exec();

    return {
      total: data.length,
      items: data,
    };
  }

  async findFilm(id: string) {
    const data = await this.filmModel
      .findOne({ id })
      .select('schedule id -_id')
      .exec();

    return {
      total: data.schedule.length,
      items: data.schedule,
    };
  }
}
