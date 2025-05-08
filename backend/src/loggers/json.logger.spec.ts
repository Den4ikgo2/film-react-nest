import { JsonLogger } from './JsonLogger';

describe('JsonLogger', () => {
  let log;
  const jsonLogger = new JsonLogger();

  beforeEach(() => {
    log = jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    log.mockReset();
  });

  it('should log correct format', () => {
    jsonLogger.warn('hi', { a: 'b', c: 1 });
    expect(log).toBeCalledTimes(1);
    expect(log).toBeCalledWith(
      '{"level":"warn","message":"hi","optionalParams":[[{"a":"b","c":1}]]}',
    );
  });
});
