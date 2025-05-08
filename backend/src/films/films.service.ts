import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { Repository } from 'typeorm';
import { Schedule } from '../order/entities/schedule.entity';

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private schedulRepository: Repository<Schedule>,
  ) {}
  async getAllFilms() {
    const data = await this.filmRepository.find();

    const films = data.map((film) => ({
      ...film,
      description: film.about,
    }));

    return {
      total: films.length,
      items: films,
    };
  }

  async findFilm(id: string) {
    const data = await this.schedulRepository.find({
      where: { filmId: id },
    });

    const schedule = data.map((item) => {
      return {
        ...item,
        taken: item.taken.split(', '),
      };
    });

    return {
      total: schedule.length,
      items: schedule,
    };
  }
}
