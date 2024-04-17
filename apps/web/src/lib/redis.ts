const keys = {
  'verrou:/api/chat/route': () => {
    return 'verrou:/api/chat/route';
  },
} as const;

export const getKey = <T extends keyof typeof keys>(
  lock: T,
  options?: Parameters<(typeof keys)[T]>[0],
) => {
  // If we need to add a parameter, we define it in the function itself in the locks object and it will be inferred.
  // @ts-expect-error -- TODO
  return keys[lock](options);
};

Object.freeze(keys);
