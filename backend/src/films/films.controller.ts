import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  findAll() {
    return this.filmsService.getAllFilms();
  }

  @Get(':id/schedule')
  findOne(@Param('id') id: string) {
    return this.filmsService.findFilm(id);
  }
}
