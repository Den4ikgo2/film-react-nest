import { Test } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { Schedule } from '../order/entities/schedule.entity';

describe('filmsController', () => {
  let filmsService: FilmsService;
  let filmController: FilmsController;

  const mockBaseFilms = [
    {
      id: '1',
      rating: '5',
      director: 'Василий',
      tags: '777',
      image: 'url',
      cover: 'url',
      title: 'Угадай',
      about: 'Неугадайка',
      schedule: [],
    },
  ];

  const mockBaseSchedule = [
    {
      id: '2',
      daytime: 'day',
      hall: 1,
      rows: 1,
      seats: 1,
      price: 100,
      taken: ['1:1', '2:3'],
      filmId: '1',
      film: mockBaseFilms[0],
    },
    {
      id: '3',
      daytime: 'day',
      hall: 2,
      rows: 1,
      seats: 3,
      price: 100,
      taken: ['1:1', '2:3'],
      filmId: '1',
      film: mockBaseFilms[0],
    },
  ];

  const mockFilmRepository = {
    find: jest.fn().mockResolvedValue([mockBaseFilms]),
  };

  const mockScheduleRepository = {
    find: jest.fn().mockResolvedValue(mockBaseSchedule),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        FilmsService,
        {
          provide: getRepositoryToken(Film),
          useValue: mockFilmRepository,
        },
        {
          provide: getRepositoryToken(Schedule),
          useValue: mockScheduleRepository,
        },
      ],
    }).compile();

    filmsService = moduleRef.get(FilmsService);
    filmController = moduleRef.get(FilmsController);
  });

  describe('findAll', () => {
    it('should return an array of films', async () => {
      const mockDate = mockBaseFilms.map((item) => ({
        ...item,
        description: item.about,
      }));

      const result = { total: mockDate.length, items: mockDate };

      jest
        .spyOn(filmsService, 'getAllFilms')
        .mockImplementation(async () => result);

      expect(await filmController.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return an film ID', async () => {
      const id = '1';
      const expectedFilm = {
        total: mockBaseSchedule.length,
        items: mockBaseSchedule,
      };

      jest.spyOn(filmsService, 'findFilm').mockResolvedValue(expectedFilm);

      const result = await filmController.findOne(id);

      expect(result).toEqual(expectedFilm);
    });
  });
});
