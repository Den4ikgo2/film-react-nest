import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { serverConfig } from './config/сonnection';
import { DevLogger } from './loggers/DevLogger';
import { JsonLogger } from './loggers/JsonLogger';
import { TSKVLogger } from './loggers/TSKVLogger';

const loggerType = process.env.LOGGER_TYPE || 'TSKVLogger';
let logger;

switch (loggerType) {
  case 'DevLogger':
    logger = new DevLogger();
    break;
  case 'JsonLogger':
    logger = new JsonLogger();
    break;
  case 'TSKVLogger':
  default:
    logger = new TSKVLogger();
    break;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useLogger(logger);
  await app.listen(serverConfig.port);
}
bootstrap();
