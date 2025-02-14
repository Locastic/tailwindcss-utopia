import { css, html, js } from "./utils";

export const defaultHtml = html`<h1>Heading H1</h1>
<h2>Heading H2</h2>
<h3>Heading H3</h3>
<h4>Heading H4</h4>
<h5>Heading H5</h5>
<h6>Heading H6</h6>`;

export const defaultCss = css`@tailwind base;
@tailwind components;
@tailwind utilities;

h1, h2, h3, h4, h5, h6 {
  @apply font-bold;
}

h1 {
  @apply ~text-x5;
}

h2 {
  @apply ~text-x4;
}

h3 {
  @apply ~text-x3;
}

h4 {
  @apply ~text-x2;
}

h5 {
  @apply ~text-x1;
}

body {
  @apply ~text-1;
}`;

export const defaultConfig = js`/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      // ...
    },
  }
};`;
