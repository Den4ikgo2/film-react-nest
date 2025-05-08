import { Repository } from 'typeorm';
import { OrderService } from './order.service';
import { Schedule } from './entities/schedule.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { OrderController } from './order.controller';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let orderRepository: Repository<Schedule>;

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
      order: [],
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
      controllers: [OrderController],
      providers: [
        OrderService,
        {
          provide: SCHEDULE_REPOSITORY_TOKEN,
          useValue: mockScheduleRepository,
        },
      ],
    }).compile();

    orderController = moduleRef.get<OrderController>(OrderController);
    orderService = moduleRef.get<OrderService>(OrderService);
    orderRepository = moduleRef.get<Repository<Schedule>>(
      SCHEDULE_REPOSITORY_TOKEN,
    );
  });

  describe('create', () => {
    it('should create order', async () => {
      const result = {
        total: 1,
        items: [
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

      jest.spyOn(orderService, 'createOrder').mockResolvedValue(result);

      expect(await orderController.create(mockTicketOrder)).toBe(result);
      expect(orderService.createOrder).toHaveBeenCalledWith(mockTicketOrder);
    });
  });
});
