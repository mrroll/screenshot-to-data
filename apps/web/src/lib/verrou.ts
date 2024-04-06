const locks = {
  '/api/chat/route': () => {
    return '/api/chat/route';
  },
} as const;

export const getLock = <T extends keyof typeof locks>(
  lock: T,
  options?: Parameters<(typeof locks)[T]>[0],
) => {
  // If we need to add a parameter, we define it in the function itself in the locks object and it will be inferred.
  // @ts-expect-error -- TODO
  return locks[lock](options);
};

Object.freeze(locks);
