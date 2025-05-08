import { TSKVLogger } from './TSKVLogger';

describe('TskvLogger', () => {
  let log;
  const tskvLogger = new TSKVLogger();

  beforeEach(() => {
    log = jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    log.mockReset();
  });

  it('should log correct format', () => {
    tskvLogger.warn('hi', { a: 'b', c: 1 });
    expect(log).toBeCalledTimes(1);
    expect(log).toBeCalledWith(
      'level=warn\tmessage=hi\toptionalParams=[[{"a":"b","c":1}]]',
    );
  });
});
