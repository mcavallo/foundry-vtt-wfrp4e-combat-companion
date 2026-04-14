import type { AdvantageCap } from '@/constants';

declare module 'fvtt-types/configuration' {
  interface SettingConfig {
    'wfrp4e-combat-companion.enableAdvantage': boolean;
    'wfrp4e-combat-companion.advantageCap': AdvantageCap;
  }
}
