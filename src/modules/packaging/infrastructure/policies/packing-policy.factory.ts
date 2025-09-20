import { ConfigService } from '@nestjs/config';
import { PackingPolicy } from './packing.policy';

export const packingPolicyFactory = (config: ConfigService): PackingPolicy => ({
  bigH: Number(config.get('PACK_BIG_H')) || 40,
  bigW: Number(config.get('PACK_BIG_W')) || 50,
  maxWithBig: Number(config.get('PACK_MAX_ITEMS_WITH_BIG')) || 2,
});
