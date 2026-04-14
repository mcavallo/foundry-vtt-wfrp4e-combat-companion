import { ADVANTAGE_CAP, type AdvantageCap, MODULE, SETTINGS } from '@/constants';

/**
 * Register all module settings with Foundry's settings system.
 */
export const registerSettings = () => {
  (game.settings!.register as Function)(MODULE.ID, SETTINGS.ENABLE_ADVANTAGE, {
    name: `${MODULE.ID}.settings.enableAdvantage.name`,
    hint: `${MODULE.ID}.settings.enableAdvantage.hint`,
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  (game.settings!.register as Function)(MODULE.ID, SETTINGS.ADVANTAGE_CAP, {
    name: `${MODULE.ID}.settings.advantageCap.name`,
    hint: `${MODULE.ID}.settings.advantageCap.hint`,
    scope: 'world',
    config: true,
    type: String,
    default: ADVANTAGE_CAP.SYSTEM,
    choices: {
      [ADVANTAGE_CAP.SYSTEM]: `${MODULE.ID}.settings.advantageCap.choices.system`,
      [ADVANTAGE_CAP.HALF_IB]: `${MODULE.ID}.settings.advantageCap.choices.halfIB`,
    },
  });
};

/**
 * Whether the advantage widget feature is enabled.
 */
export const getEnableAdvantage = (): boolean =>
  (game.settings!.get as Function)(MODULE.ID, SETTINGS.ENABLE_ADVANTAGE) as boolean;

/**
 * Which advantage cap mode is configured (system or half IB).
 */
export const getAdvantageCap = (): AdvantageCap =>
  (game.settings!.get as Function)(
    MODULE.ID,
    SETTINGS.ADVANTAGE_CAP
  ) as AdvantageCap;
