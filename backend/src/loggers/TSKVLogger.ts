import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TSKVLogger implements LoggerService {
  formatMessage(level: string, message: any, ...optionalParams: any[]) {
    return console.log(
      `level=${level}\tmessage=${message}\toptionalParams=${optionalParams}\n`,
    );
  }
  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, optionalParams));
  }
  error(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('error', message, optionalParams));
  }
  warn(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('warn', message, optionalParams));
  }
}
