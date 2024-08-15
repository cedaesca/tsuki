import { Reflector } from '@nestjs/core';
import { IsCommand } from './is-command.decorator';
import { IS_COMMAND_METAKEY } from '../constants/general-constants';

describe('@IsCommand decorator', () => {
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
  });

  it('should set metadata using IS_COMMAND_METAKEY only', () => {
    @IsCommand()
    class TestCommand {}

    const metadata = reflector.get<boolean>(IS_COMMAND_METAKEY, TestCommand);

    const otherMetadataKeys = Reflect.getMetadataKeys(TestCommand);
    const isCommandKeyUsed = otherMetadataKeys.includes(IS_COMMAND_METAKEY);

    expect(metadata).toBe(true);
    expect(isCommandKeyUsed).toBe(true);
    expect(otherMetadataKeys.length).toBe(1);
  });

  it('should set metadata correctly on the class', () => {
    @IsCommand()
    class TestCommand {}

    const metadata = reflector.get<boolean>(IS_COMMAND_METAKEY, TestCommand);

    expect(metadata).toBe(true);
  });

  it('should not set metadata on a class without the decorator', () => {
    class NoMetadataCommand {}

    const metadata = reflector.get<boolean>(
      IS_COMMAND_METAKEY,
      NoMetadataCommand,
    );

    expect(metadata).toBeUndefined();
  });
});
