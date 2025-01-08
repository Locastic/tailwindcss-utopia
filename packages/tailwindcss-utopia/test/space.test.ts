import { describe, it, expect } from "bun:test";

import { css, html, run } from "./run";

describe("space normal classes should", () => {
  it("have working base space (S)", async () => {
    const content = html`<span class="~m-s"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css`
      .\~m-s {
        margin: var(--space-s); /* 18 ${"→"} 20 */
      }
    `);
  });

  it("support negative variant", async () => {
    const content = html`<span class="~-m-s"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css`
      .\~-m-s {
        margin: calc(var(--space-s) * -1); /* -18 ${"→"} -20 */
      }
    `);
  });

  it("not support negative variant on non negative utility", async () => {
    const content = html`<span class="~-p-s"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css``);
  });
});

describe("space arbitrary classes should", () => {
  it("have working default (max) value", async () => {
    const content = html`<span class="~p-[20]"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css`
      .\~p-\[20\] {
        padding: clamp(
          1.125rem,
          1.0815rem + 0.2174vw,
          1.25rem
        ); /* 18 ${"→"} 20 */
      }
    `);
  });

  it("have working [/max] value", async () => {
    const content = html`<span class="~p-[/20]"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css`
      .\~p-\[\/20\] {
        padding: clamp(
          1.125rem,
          1.0815rem + 0.2174vw,
          1.25rem
        ); /* 18 ${"→"} 20 */
      }
    `);
  });

  it("have working [min/] value", async () => {
    const content = html`<span class="~p-[18/]"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css`
      .\~p-\[18\/\] {
        padding: clamp(
          1.125rem,
          1.0815rem + 0.2174vw,
          1.25rem
        ); /* 18 ${"→"} 20 */
      }
    `);
  });

  it("have working [min/max] values", async () => {
    const content = html`<span class="~p-[24/32]"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css`
      .\~p-\[24\/32\] {
        padding: clamp(1.5rem, 1.3261rem + 0.8696vw, 2rem); /* 24 ${"→"} 32 */
      }
    `);
  });

  it("not have working default empty value", async () => {
    const content = html`<span class="~p-[]"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css``);
  });

  it("support negative value", async () => {
    const content = html`<span class="~m-[-32]"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css`
      .\~m-\[-32\] {
        margin: clamp(
          -2.2222rem,
          -2.2995rem + 0.3865vw,
          -2rem
        ); /* -35.5552 ${"→"} -32 */
      }
    `);
  });

  it("support negative variant on a negative value", async () => {
    const content = html`<span class="~-m-[-32]"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css`
      .\~-m-\[-32\] {
        margin: calc(
          clamp(-2.2222rem, -2.2995rem + 0.3865vw, -2rem) * -1
        ); /* 35.5552 ${"→"} 32 */
      }
    `);
  });

  it("not have working non-value", async () => {
    const content = html`<span class="~m-[a/b]"></span>`;

    const result = await run(content);

    expect(result.css).toMatchFormattedCss(css``);
  });
});
