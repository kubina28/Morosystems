import { test } from '@playwright/test';

type StepName<Args extends unknown[]> = string | ((...args: Args) => string);

export function step<This extends object, Args extends unknown[], Return>(name?: StepName<Args>) {
  return function decorate(
    target: (this: This, ...args: Args) => Promise<Return>,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>,
  ) {
    return function wrapped(this: This, ...args: Args): Promise<Return> {
      const title =
        typeof name === 'function'
          ? name(...args)
          : (name ?? `${this.constructor.name}.${String(context.name)}`);
      // `box` reports a failure at the call site in the test instead of inside the page object.
      return test.step(title, () => target.call(this, ...args), { box: true });
    };
  };
}
