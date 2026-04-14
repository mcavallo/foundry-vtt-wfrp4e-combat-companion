import { MODULE } from '@/constants';
import { onRenderActorSheet } from '@/hooks/renderActorSheet';
import { onRenderCombatTracker } from '@/hooks/renderCombatTracker';
import { getEnableAdvantage } from '@/lib/SettingsManager';

const ADVANTAGE_BODY_CLASS = `${MODULE.PREFIX}-advantage-enabled`;

/**
 * Toggle the body class that controls CSS visibility of the
 * system's native advantage field.
 */
const syncAdvantageBodyClass = () => {
  document.body.classList.toggle(ADVANTAGE_BODY_CLASS, getEnableAdvantage());
};

/**
 * Register all non-init hooks for the module.
 * Called once from the init hook in module.ts.
 */
export const setupHooks = () => {
  Hooks.once('setup', syncAdvantageBodyClass);

  /**
   * Re-sync body class and re-render combat tracker and open actor sheets
   * when any module setting changes.
   */
  const onSettingChanged = (setting: any) => {
    if (!setting.key.startsWith(`${MODULE.ID}.`)) return;
    syncAdvantageBodyClass();
    ui.combat?.render();
    foundry.applications.instances.forEach((app: any) => {
      if (app.document instanceof Actor) app.render();
    });
  };

  Hooks.on('updateSetting', onSettingChanged);
  Hooks.on('createSetting', onSettingChanged);

  Hooks.on('renderCombatTracker', onRenderCombatTracker);

  const actorSheetHooks = [
    'renderActorSheetWFRP4eCharacter',
    'renderActorSheetWFRP4eNPC',
    'renderActorSheetWFRP4eCreature',
  ];
  for (const hook of actorSheetHooks) {
    (Hooks.on as Function)(hook, onRenderActorSheet);
  }
};
