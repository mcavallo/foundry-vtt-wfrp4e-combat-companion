import '@/components/AdvantageWidget';
import { MODULE } from '@/constants';
import { AdvantageWidget } from '@/components/AdvantageWidget';
import { canEditAdvantage, getAdvantageValue } from '@/lib/advantage';
import { getEnableAdvantage } from '@/lib/SettingsManager';

const POPOVER_ID = `${MODULE.PREFIX}-advantage-popover`;

let openPopoverCombatantId: string | null = null;

/**
 * Close the currently open advantage popover with a fade-out animation.
 */
const closePopover = () => {
  openPopoverCombatantId = null;
  const existing = document.getElementById(POPOVER_ID);
  if (!existing) return;
  existing.classList.add('closing');
  existing.addEventListener('animationend', () => existing.remove(), { once: true });
};

/**
 * Create and attach an advantage popover to the given badge element.
 * Contains an AdvantageWidget for the combatant's actor.
 * Closes on mouseleave.
 */
const createPopover = (
  badge: HTMLElement,
  combatant: Combatant.Implementation,
  skipAnimation = false
) => {
  closePopover();
  openPopoverCombatantId = combatant.id;

  const popover = document.createElement('div');
  popover.id = POPOVER_ID;
  popover.classList.add(`${MODULE.PREFIX}-advantage-popover`);
  if (skipAnimation) popover.classList.add('no-animation');

  const widget = document.createElement(AdvantageWidget.TAG) as AdvantageWidget;
  widget.actor = combatant.actor!;
  popover.append(widget);

  const row = badge.closest('.combatant') as HTMLElement;
  row.style.position = 'relative';
  row.append(popover);

  const stopBubble = (e: Event) => e.stopPropagation();
  popover.addEventListener('click', stopBubble);
  popover.addEventListener('dblclick', stopBubble);
  popover.addEventListener('mousedown', stopBubble);
  popover.addEventListener('pointerdown', stopBubble);
  popover.addEventListener('mouseleave', closePopover);
};

/**
 * Create an advantage badge element for a combatant row.
 * Shows the current value, highlights when > 0, and opens
 * a popover on click if the user has edit permission.
 */
const createBadge = (combatant: Combatant.Implementation): HTMLSpanElement => {
  const value = getAdvantageValue(combatant.actor!);
  const editable = canEditAdvantage(combatant.actor!);

  const badge = document.createElement('span');
  badge.classList.add(`${MODULE.PREFIX}-advantage-badge`);
  if (value > 0) badge.classList.add('has-advantage');
  if (editable) badge.classList.add('editable');
  badge.textContent = String(value);
  badge.title = game.i18n!.localize(`${MODULE.ID}.advantage.label`);

  if (editable) {
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      createPopover(badge, combatant);
    });
  }

  return badge;
};

/**
 * Hook handler for renderCombatTracker.
 * Injects advantage badges into each combatant row and restores
 * any previously open popover after re-render.
 */
export const onRenderCombatTracker = (app: CombatTracker.Any, html: HTMLElement) => {
  if (!getEnableAdvantage()) return;

  const combat = app.viewed;
  if (!combat) return;

  const combatantRows = html.querySelectorAll<HTMLLIElement>(
    '.combatant[data-combatant-id]'
  );

  for (const row of combatantRows) {
    const combatantId = row.dataset.combatantId;
    if (!combatantId) continue;

    const combatant = combat.combatants.get(combatantId);
    if (!combatant?.actor) continue;

    const badge = createBadge(combatant);

    const initiativeEl = row.querySelector('.token-initiative');
    if (initiativeEl) {
      row.insertBefore(badge, initiativeEl);
    } else {
      row.append(badge);
    }

    if (
      canEditAdvantage(combatant.actor!) &&
      openPopoverCombatantId === combatantId
    ) {
      createPopover(badge, combatant, true);
    }
  }
};
