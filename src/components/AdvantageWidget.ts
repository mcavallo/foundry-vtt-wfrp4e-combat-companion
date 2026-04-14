import { ADVANTAGE_CAP, MODULE } from '@/constants';
import { getAdvantageCap } from '@/lib/SettingsManager';

/**
 * Custom element that displays and controls a combatant's advantage value.
 * Renders +/−/clear buttons when editable, or a read-only value display.
 * Themed via variant attribute ("sheet" or default popover style).
 */
export class AdvantageWidget extends HTMLElement {
  static readonly TAG = `${MODULE.PREFIX}-advantage-widget`;

  private _actor: Actor.Implementation | null = null;
  private _readonly = false;

  /**
   * Set the actor whose advantage this widget controls. Triggers a render.
   */
  set actor(actor: Actor.Implementation) {
    this._actor = actor;
    this.render();
  }

  /**
   * When true, hides all buttons and shows only the value display.
   */
  set readonly(value: boolean) {
    this._readonly = value;
    this.classList.toggle('readonly', value);
  }

  private get actorData(): any {
    return this._actor as any;
  }

  /**
   * Current advantage value from the actor's system data.
   */
  private get value(): number {
    return this.actorData?.system?.status?.advantage?.value ?? 0;
  }

  /**
   * Maximum advantage based on the configured cap mode.
   * Uses half IB (rounded up) or the system's own max.
   */
  private get max(): number {
    if (getAdvantageCap() === ADVANTAGE_CAP.HALF_IB) {
      const ib: number = this.actorData?.system?.characteristics?.i?.bonus ?? 0;
      return Math.ceil(ib / 2);
    }
    return this.actorData?.system?.status?.advantage?.max ?? 10;
  }

  /**
   * Persist a new advantage value to the actor, clamped to [0, max].
   */
  private async updateValue(newValue: number) {
    const clamped = Math.max(0, Math.min(newValue, this.max));
    await this._actor?.update({
      'system.status.advantage.value': clamped,
    } as any);
  }

  /**
   * Build the widget DOM and attach event listeners.
   * In readonly mode, renders only the value display.
   */
  private render() {
    const { value, max } = this;

    if (this._readonly) {
      this.innerHTML = `<span class="advantage-value"><span class="current">${value}</span><span class="separator">/</span><span class="max">${max}</span></span>`;
      return;
    }

    this.innerHTML = `
      <span class="advantage-btn dec"><i class="fa-solid fa-minus"></i></span>
      <span class="advantage-value"><span class="current">${value}</span><span class="separator">/</span><span class="max">${max}</span></span>
      <span class="advantage-btn inc"><i class="fa-solid fa-plus"></i></span>
      <span class="advantage-btn clear"><i class="fa-solid fa-xmark"></i></span>
    `;

    const decBtn = this.querySelector('.dec')!;
    const incBtn = this.querySelector('.inc')!;
    const clearBtn = this.querySelector('.clear')!;

    decBtn.classList.toggle('disabled', value <= 0);
    clearBtn.classList.toggle('disabled', value <= 0);
    incBtn.classList.toggle('disabled', value >= max);

    decBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.value <= 0) return;
      this.updateValue(this.value - 1);
    });

    incBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.value >= this.max) return;
      this.updateValue(this.value + 1);
    });

    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.value <= 0) return;
      this.updateValue(0);
    });
  }
}

customElements.define(AdvantageWidget.TAG, AdvantageWidget);
