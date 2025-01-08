import { describe, it, expect } from "bun:test";

import { css, html, run } from "./run";

describe("text normal classes should", () => {
  it("have working base font size", async () => {
    const content = html`<span class="~text-1"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css`
      .\~text-1 {
        font-size: var(--step-0); /* 18 ${"→"} 20 */
      }
    `);
  });
});

describe("text arbitrary classes should", () => {
  it("have working default (max) value", async () => {
    const content = html`<span class="~text-[20]"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css`
      .\~text-\[20\] {
        font-size: clamp(
          1.125rem,
          1.0815rem + 0.2174vw,
          1.25rem
        ); /* 18 ${"→"} 20 */
      }
    `);
  });

  it("have working [/max] value", async () => {
    const content = html`<span class="~text-[/20]"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css`
      .\~text-\[\/20\] {
        font-size: clamp(
          1.125rem,
          1.0815rem + 0.2174vw,
          1.25rem
        ); /* 18 ${"→"} 20 */
      }
    `);
  });

  it("have working [min/] value", async () => {
    const content = html`<span class="~text-[18/]"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css`
      .\~text-\[18\/\] {
        font-size: clamp(
          1.125rem,
          1.0815rem + 0.2174vw,
          1.25rem
        ); /* 18 ${"→"} 20 */
      }
    `);
  });

  it("have working [min/max] values", async () => {
    const content = html`<span class="~text-[24/32]"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css`
      .\~text-\[24\/32\] {
        font-size: clamp(1.5rem, 1.3261rem + 0.8696vw, 2rem); /* 24 ${"→"} 32 */
      }
    `);
  });

  it("not have working default negative value", async () => {
    const content = html`<span class="~text-[-20]"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css``);
  });

  it("not have working default empty value", async () => {
    const content = html`<span class="~text-[]"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css``);
  });

  it("have working step [x(N)] value", async () => {
    const content = html`<span class="~text-[x0]"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css`
      .\~text-\[x0\] {
        font-size: clamp(
          1.125rem,
          1.0815rem + 0.2174vw,
          1.25rem
        ); /* 18 ${"→"} 20 */
      }
    `);
  });

  it("have working negative step [x(-N)] value", async () => {
    const content = html`<span class="~text-[x-1]"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css`
      .\~text-\[x-1\] {
        font-size: clamp(
          0.9375rem,
          0.9158rem + 0.1087vw,
          1rem
        ); /* 15 ${"→"} 16 */
      }
    `);
  });

  it("not have working non-value step", async () => {
    const content = html`<span class="~text-[xx]"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css``);
  });
});
