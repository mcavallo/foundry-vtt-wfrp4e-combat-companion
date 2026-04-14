export const MODULE = {
  NAME: 'WFRP4e Combat Companion',
  ID: 'wfrp4e-combat-companion',
  PREFIX: 'wfrp4e-ccm',
} as const;

export const ADVANTAGE_CAP = {
  SYSTEM: 'system',
  HALF_IB: 'halfIB',
} as const;

export type AdvantageCap = (typeof ADVANTAGE_CAP)[keyof typeof ADVANTAGE_CAP];

export const SETTINGS = {
  ENABLE_ADVANTAGE: 'enableAdvantage',
  ADVANTAGE_CAP: 'advantageCap',
} as const;
