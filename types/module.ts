import type defaultTranslationsFile from '@/lang/en.json';

type LeafPath<T, Prev extends string = ''> = {
  [K in keyof T & string]: T[K] extends Record<string, any>
    ? LeafPath<T[K], `${Prev}${K}.`>
    : `${Prev}${K}`;
}[keyof T & string];

export type TranslationsFile = typeof defaultTranslationsFile;
export type Translations =
  (typeof defaultTranslationsFile)['wfrp4e-combat-companion'];
export type TranslationKeys = LeafPath<Translations>;
