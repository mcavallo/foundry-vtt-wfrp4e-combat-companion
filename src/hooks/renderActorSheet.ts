import '@/components/AdvantageWidget';
import { MODULE } from '@/constants';
import { AdvantageWidget } from '@/components/AdvantageWidget';
import { canEditAdvantage } from '@/lib/advantage';
import { getEnableAdvantage } from '@/lib/SettingsManager';

/**
 * Hook handler for WFRP4e actor sheet rendering.
 * Injects an advantage widget into the combat tab, wrapped
 * in a form-group layout matching the sheet's style.
 */
export const onRenderActorSheet = (app: ActorSheet.Any, html: HTMLElement) => {
  if (!getEnableAdvantage()) return;

  const combatTab = html.querySelector<HTMLElement>(
    'section.tab[data-tab="combat"]'
  );
  if (!combatTab) return;

  const actor = app.document;

  const canEdit = canEditAdvantage(actor);

  const widget = document.createElement(AdvantageWidget.TAG) as AdvantageWidget;
  widget.setAttribute('variant', 'sheet');
  widget.readonly = !canEdit;
  widget.actor = actor;

  const fields = document.createElement('div');
  fields.classList.add('form-fields');
  fields.append(widget);

  const label = document.createElement('label');
  label.style.flex = '1';
  label.textContent = game.i18n!.localize(`${MODULE.ID}.advantage.label`);

  const group = document.createElement('div');
  group.classList.add('form-group', `${MODULE.PREFIX}-advantage-group`);
  group.append(label, fields);

  combatTab.prepend(group);
};
