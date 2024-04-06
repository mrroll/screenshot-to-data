// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
export class PromiseWithResolvers<T> extends Promise<T> {
  static withResolvers<T>() {
    let resolve: (value: T | PromiseLike<T>) => void = () => void 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Promise.reject() can take any value
    let reject: (reason?: any) => void = () => void 0;

    const promise = new this<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });

    return { promise, resolve, reject };
  }
}
