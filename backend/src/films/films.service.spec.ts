import { Test } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { Film } from './entities/film.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Schedule } from '../order/entities/schedule.entity';
import { Repository } from 'typeorm';

describe('FilmsService', () => {
  let filmsService: FilmsService;
  let filmRepository: Repository<Film>;
  let scheduleRepository: Repository<Schedule>;

  const FILM_REPOSITORY_TOKEN = getRepositoryToken(Film);
  const SCHEDULE_REPOSITORY_TOKEN = getRepositoryToken(Schedule);

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
      taken: '1:1, 2:3',
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
      taken: '1:1, 2:3',
      filmId: '2',
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
      providers: [
        FilmsService,
        {
          provide: FILM_REPOSITORY_TOKEN,
          useValue: mockFilmRepository,
        },
        {
          provide: SCHEDULE_REPOSITORY_TOKEN,
          useValue: mockScheduleRepository,
        },
      ],
    }).compile();

    filmsService = moduleRef.get<FilmsService>(FilmsService);
    filmRepository = moduleRef.get<Repository<Film>>(FILM_REPOSITORY_TOKEN);
    scheduleRepository = moduleRef.get<Repository<Schedule>>(
      SCHEDULE_REPOSITORY_TOKEN,
    );
  });

  it('should be defined', () => {
    expect(filmsService).toBeDefined();
  });

  it('filmRepository should be defined', () => {
    expect(filmRepository).toBeDefined();
  });

  it('scheduleRepository should be defined', () => {
    expect(scheduleRepository).toBeDefined();
  });

  describe('getAllFilms', () => {
    it('Getting all the movies', async () => {
      jest.spyOn(filmRepository, 'find').mockResolvedValue(mockBaseFilms);

      const result = await filmsService.getAllFilms();

      const filmsmockBaseFilms = mockBaseFilms.map((mock) => ({
        ...mock,
        description: mock.about,
      }));

      expect(result.items).toEqual(filmsmockBaseFilms);
    });
    it('Getting total all the movies', async () => {
      jest.spyOn(filmRepository, 'find').mockResolvedValue(mockBaseFilms);

      const result = await filmsService.getAllFilms();

      expect(result.total).toEqual(mockBaseFilms.length);
    });
  });

  describe('findFilm', () => {
    it('should find and return a film by ID (items)', async () => {
      const filmId = '1';
      const mockDate = mockBaseSchedule.filter((item) => item.filmId == filmId);

      jest.spyOn(scheduleRepository, 'find').mockResolvedValue(mockDate);

      const result = await filmsService.findFilm(filmId);

      expect(result.items).toEqual(
        mockDate.map((item) => {
          return {
            ...item,
            taken: item.taken.split(', '),
          };
        }),
      );
    });

    it('should find and return a film by ID (total)', async () => {
      const filmId = '1';
      const mockDate = mockBaseSchedule.filter((item) => item.filmId == filmId);

      jest.spyOn(scheduleRepository, 'find').mockResolvedValue(mockDate);

      const result = await filmsService.findFilm(filmId);

      expect(result.total).toEqual(mockDate.length);
    });

    it('should return empty schedule when no films found', async () => {
      const filmId = '1';

      jest.spyOn(scheduleRepository, 'find').mockResolvedValue([]);

      expect(scheduleRepository.find).toHaveBeenCalledWith({
        where: { filmId: filmId },
      });
    });
  });
});
