import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configProvider } from './app.config.provider';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from './films/entities/film.entity';
import { Schedule } from './order/entities/schedule.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        /* При использовании DATABASE_DRIVER из .env, начинается ругться "useFactory" */
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        schema: configService.get('DATABASE_SCHEMA'),
        entities: [Film, Schedule],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public/',
    }),
    FilmsModule,
    OrderModule,
    // @todo: Добавьте раздачу статических файлов из public
  ],
  controllers: [],
  providers: [configProvider],
})
export class AppModule {}
