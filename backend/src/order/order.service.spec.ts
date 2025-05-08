import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { Test } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('OrederService', () => {
  let scheduleService: OrderService;
  let scheduleRepository: Repository<Schedule>;

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

  const mockBaseSchedules = [
    {
      id: '2',
      daytime: 'day',
      hall: 1,
      rows: 1,
      seats: 1,
      price: 100,
      taken: '',
      filmId: '1',
      film: mockBaseFilms[0],
    },
    {
      id: '3',
      daytime: 'day',
      hall: 1,
      rows: 1,
      seats: 1,
      price: 100,
      taken: '',
      filmId: '1',
      film: mockBaseFilms[0],
    },
  ];

  const mockTicketOrder = {
    email: 'sss',
    phone: '12345',
    tickets: [
      {
        day: '1',
        daytime: '1',
        film: '1',
        price: 100,
        row: 1,
        seat: 2,
        session: '1',
        time: '00:00',
      },
    ],
  };

  const mockScheduleRepository = {
    findOne: jest.fn().mockRejectedValue(mockBaseSchedules),
    save: jest.fn().mockRejectedValue(mockTicketOrder.tickets),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: SCHEDULE_REPOSITORY_TOKEN,
          useValue: mockScheduleRepository,
        },
      ],
    }).compile();

    scheduleService = moduleRef.get<OrderService>(OrderService);
    scheduleRepository = moduleRef.get<Repository<Schedule>>(
      SCHEDULE_REPOSITORY_TOKEN,
    );
  });

  it('should be defined', () => {
    expect(scheduleService).toBeDefined();
  });

  it('scheduleRepository should be defined', () => {
    expect(scheduleRepository).toBeDefined();
  });

  describe('createOrder', () => {
    it('adding an order', async () => {
      const orderResponseMock = {
        total: 1,
        items: [mockBaseSchedules[0]],
      };

      const mockSave = {
        id: '2',
        daytime: 'day',
        hall: 1,
        rows: 1,
        seats: 1,
        price: 100,
        taken: '1:2',
        filmId: '1',
        film: mockBaseFilms[0],
      };

      jest
        .spyOn(scheduleRepository, 'findOne')
        .mockResolvedValueOnce(mockBaseSchedules[0]);

      jest.spyOn(scheduleRepository, 'save').mockResolvedValue(mockSave);

      const result = await scheduleService.createOrder(mockTicketOrder);
      expect(result).toEqual(orderResponseMock);
    });

    it('should error', async () => {
      const mockTicket = {
        email: 'sss',
        phone: '12345',
        tickets: [
          {
            day: '1',
            daytime: '1',
            film: '3',
            price: 100,
            row: 1,
            seat: 2,
            session: '1',
            time: '00:00',
          },
        ],
      };

      jest.spyOn(scheduleRepository, 'findOne').mockResolvedValue(null);

      await expect(scheduleService.createOrder(mockTicket)).rejects.toThrow(
        `Film with id ${mockTicket.tickets[0].film} not found`,
      );
    });
  });
});
