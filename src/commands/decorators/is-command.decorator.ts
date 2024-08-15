import { SetMetadata } from '@nestjs/common';
import { IS_COMMAND_METAKEY } from '../constants/general-constants';

export const IsCommand = () => SetMetadata(IS_COMMAND_METAKEY, true);
