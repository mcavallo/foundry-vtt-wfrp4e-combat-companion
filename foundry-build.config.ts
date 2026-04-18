import { defineConfig } from '@mcavallo/foundry-build';

export default defineConfig({
  bundle: {
    entry: 'src/module.ts',
  },
  resources: {
    languages: 'src/lang',
    license: 'LICENSE',
  },
});
