/**
 * Whether the current user can modify advantage for the given actor.
 */
export const canEditAdvantage = (actor: Actor.Implementation): boolean => {
  return game.user!.isGM || actor.isOwner;
};

/**
 * Read the current advantage value from the actor's system data.
 */
export const getAdvantageValue = (actor: Actor.Implementation): number => {
  return (actor as any)?.system?.status?.advantage?.value ?? 0;
};
