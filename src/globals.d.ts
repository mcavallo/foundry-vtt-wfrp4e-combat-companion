declare global {
  type Require<C, K extends keyof C> = Partial<C> & Pick<C, K>;
}

export {};
