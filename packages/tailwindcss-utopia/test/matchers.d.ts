declare module "bun:test" {
  interface Matchers<T> {
    toMatchFormattedCss(expected: string): T;
  }
}
