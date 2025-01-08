import { describe, it, expect } from "bun:test";

import { css, html, run } from "./run";

describe("default config should", () => {
  it("generate correct variables", async () => {
    const result = await run(
      html``,
      css`
        @tailwind base;
      `,
    );

    expect(result.css).toMatchFormattedCss(css`
      :root {
        --step-5: clamp(2.7994rem, 2.4462rem + 1.7658vw, 3.8147rem);
        --step-4: clamp(2.3328rem, 2.0827rem + 1.2504vw, 3.0518rem);
        --step-3: clamp(1.944rem, 1.771rem + 0.8651vw, 2.4414rem);
        --step-2: clamp(1.62rem, 1.5041rem + 0.5793vw, 1.9531rem);
        --step-1: clamp(1.35rem, 1.2761rem + 0.3696vw, 1.5625rem);
        --step-0: clamp(1.125rem, 1.0815rem + 0.2174vw, 1.25rem);
        --step--1: clamp(0.9375rem, 0.9158rem + 0.1087vw, 1rem);
        --step--2: clamp(0.7813rem, 0.7747rem + 0.0326vw, 0.8rem);
        --space-3xs: clamp(0.3125rem, 0.3125rem + 0vw, 0.3125rem);
        --space-2xs: clamp(0.5625rem, 0.5408rem + 0.1087vw, 0.625rem);
        --space-xs: clamp(0.875rem, 0.8533rem + 0.1087vw, 0.9375rem);
        --space-s: clamp(1.125rem, 1.0815rem + 0.2174vw, 1.25rem);
        --space-m: clamp(1.6875rem, 1.6223rem + 0.3261vw, 1.875rem);
        --space-l: clamp(2.25rem, 2.163rem + 0.4348vw, 2.5rem);
        --space-xl: clamp(3.375rem, 3.2446rem + 0.6522vw, 3.75rem);
        --space-2xl: clamp(4.5rem, 4.3261rem + 0.8696vw, 5rem);
        --space-3xl: clamp(6.75rem, 6.4891rem + 1.3043vw, 7.5rem);
        --space-3xs-2xs: clamp(0.3125rem, 0.2038rem + 0.5435vw, 0.625rem);
        --space-2xs-xs: clamp(0.5625rem, 0.4321rem + 0.6522vw, 0.9375rem);
        --space-xs-s: clamp(0.875rem, 0.7446rem + 0.6522vw, 1.25rem);
        --space-s-m: clamp(1.125rem, 0.8641rem + 1.3043vw, 1.875rem);
        --space-m-l: clamp(1.6875rem, 1.4049rem + 1.413vw, 2.5rem);
        --space-l-xl: clamp(2.25rem, 1.7283rem + 2.6087vw, 3.75rem);
        --space-xl-2xl: clamp(3.375rem, 2.8098rem + 2.8261vw, 5rem);
        --space-2xl-3xl: clamp(4.5rem, 3.4565rem + 5.2174vw, 7.5rem);
        --space-s-l: clamp(1.125rem, 0.6467rem + 2.3913vw, 2.5rem);
      }
    `);
  });

  it("generate correct text classes", async () => {
    const content = html`<div>
      <span class="~text-x5"></span>
      <span class="~text-x4"></span>
      <span class="~text-x3"></span>
      <span class="~text-x2"></span>
      <span class="~text-x1"></span>
      <span class="~text-1"></span>
      <span class="~text-x-1"></span>
      <span class="~text-x-2"></span>
    </div>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css`
      .\~text-1 {
        font-size: var(--step-0); /* 18 ${"→"} 20 */
      }
      .\~text-x-1 {
        font-size: var(--step--1); /* 15 ${"→"} 16 */
      }
      .\~text-x-2 {
        font-size: var(--step--2); /* 12.5008 ${"→"} 12.8 */
      }
      .\~text-x1 {
        font-size: var(--step-1); /* 21.6 ${"→"} 25 */
      }
      .\~text-x2 {
        font-size: var(--step-2); /* 25.92 ${"→"} 31.2496 */
      }
      .\~text-x3 {
        font-size: var(--step-3); /* 31.104 ${"→"} 39.0624 */
      }
      .\~text-x4 {
        font-size: var(--step-4); /* 37.3248 ${"→"} 48.8288 */
      }
      .\~text-x5 {
        font-size: var(--step-5); /* 44.7904 ${"→"} 61.0352 */
      }
    `);
  });

  it("generate correct space classes", async () => {
    const content = html`<div>
        <span class="~m-3xl"></span>
        <span class="~m-2xl"></span>
        <span class="~m-xl"></span>
        <span class="~m-l"></span>
        <span class="~m-m"></span>
        <span class="~m-s"></span>
        <span class="~m-xs"></span>
        <span class="~m-2xs"></span>
        <span class="~m-3xs"></span>
      </div>
      <div>
        <span class="~m-2xl-3xl"></span>
        <span class="~m-xl-2xl"></span>
        <span class="~m-l-xl"></span>
        <span class="~m-m-l"></span>
        <span class="~m-s-m"></span>
        <span class="~m-xs-s"></span>
        <span class="~m-2xs-xs"></span>
        <span class="~m-3xs-2xs"></span>
      </div>
      <div>
        <span class="~m-s-l"></span>
      </div>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css`
      .\~m-2xl {
        margin: var(--space-2xl); /* 72 ${"→"} 80 */
      }
      .\~m-2xl-3xl {
        margin: var(--space-2xl-3xl); /* 72 ${"→"} 120 */
      }
      .\~m-2xs {
        margin: var(--space-2xs); /* 9 ${"→"} 10 */
      }
      .\~m-2xs-xs {
        margin: var(--space-2xs-xs); /* 9 ${"→"} 15 */
      }
      .\~m-3xl {
        margin: var(--space-3xl); /* 108 ${"→"} 120 */
      }
      .\~m-3xs {
        margin: var(--space-3xs); /* 5 ${"→"} 5 */
      }
      .\~m-3xs-2xs {
        margin: var(--space-3xs-2xs); /* 5 ${"→"} 10 */
      }
      .\~m-l {
        margin: var(--space-l); /* 36 ${"→"} 40 */
      }
      .\~m-l-xl {
        margin: var(--space-l-xl); /* 36 ${"→"} 60 */
      }
      .\~m-m {
        margin: var(--space-m); /* 27 ${"→"} 30 */
      }
      .\~m-m-l {
        margin: var(--space-m-l); /* 27 ${"→"} 40 */
      }
      .\~m-s {
        margin: var(--space-s); /* 18 ${"→"} 20 */
      }
      .\~m-s-l {
        margin: var(--space-s-l); /* 18 ${"→"} 40 */
      }
      .\~m-s-m {
        margin: var(--space-s-m); /* 18 ${"→"} 30 */
      }
      .\~m-xl {
        margin: var(--space-xl); /* 54 ${"→"} 60 */
      }
      .\~m-xl-2xl {
        margin: var(--space-xl-2xl); /* 54 ${"→"} 80 */
      }
      .\~m-xs {
        margin: var(--space-xs); /* 14 ${"→"} 15 */
      }
      .\~m-xs-s {
        margin: var(--space-xs-s); /* 14 ${"→"} 20 */
      }
    `);
  });
});
