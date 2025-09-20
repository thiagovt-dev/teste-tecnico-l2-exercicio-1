import { InjectionToken } from '@nestjs/common';

export const PACKING_POLICY = 'PACKING_POLICY' as InjectionToken;

export interface PackingPolicy {
  bigH: number;
  bigW: number;
  maxWithBig: number;
}
