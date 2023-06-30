class MyPromiseType<T> implements Promise<T> {
  constructor(
    private cb: (
      resolve: (value: T) => any,
      reject: (...args: any[]) => any,
    ) => any
  ) {
    console.debug('Promise constructed');

    // cb(this.then);
    this.then = cb;
  }

  // then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2> {
  //   console.debug('THEN CALLED')
  //   return this as any;
  // }

  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): Promise<T | TResult> {
    console.debug('CATCH CALLED!');
    return this;
  }

  finally(onfinally?: (() => void) | null | undefined): Promise<T> {
    console.debug('FINALLY CALLED');
    return this;
  }

  chainCount = 0;

  chain(): this {
    console.debug(`Chain count: ${++this.chainCount}`);
    return this;
  }

  get [Symbol.toStringTag]() {
    return 'Object MyPromiseType';
  }
}

const p = new MyPromiseType();

p.chain().chain().chain();

await p;