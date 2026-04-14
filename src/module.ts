import './module.css';
import { setupHooks } from '@/hooks/setup';
import { registerSettings } from '@/lib/SettingsManager';

Hooks.once('init', () => {
  registerSettings();
  setupHooks();
});
