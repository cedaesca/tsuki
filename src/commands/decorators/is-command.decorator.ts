import { SetMetadata } from '@nestjs/common';
import { COMMAND_METADATA } from '../constants/general-constants';

export const IsCommand = () => SetMetadata(COMMAND_METADATA, true);
