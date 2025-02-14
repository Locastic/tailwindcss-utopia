import { css, html, js } from "./utils";

export const defaultHtml = html`<!--
  Welcome to Tailwind Play, the official Tailwind CSS playground!

  Everything here works just like it does when you're running Tailwind locally
  with a real build pipeline. You can customize your config file, use features
  like ${"`"}@apply${"`"}.

  Feel free to play with this example if you're just learning, or trash it and
  start from scratch if you know enough to be dangerous. Have fun!
-->
<div class="max-w-[767px] box-content mx-auto px-8">
  <div class="bg-slate-900 text-slate-50 ~rounded-[25/0]">
    <div class="~m-s-l ~pb-xl-2xl ~space-y-m-l">
      <header class="flex justify-between items-center ~pt-m-l ~pb-s-l ~text-x-1">
        <svg class="~h-l ~w-l" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="24" fill="#7690A4"></rect>
          <path
            d="M39 24c0 8.284-6.716 15-15 15m15-15c0-8.284-6.716-15-15-15m15 15H9m15 15c-8.284 0-15-6.716-15-15m15 15a22.95 22.95 0 0 0 6-15 22.95 22.95 0 0 0-6-15m0 30a22.95 22.95 0 0 1-6-15 22.95 22.95 0 0 1 6-15M9 24c0-8.284 6.716-15 15-15"
            stroke="#001F35" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
        <ul class="flex items-center justify-end ~space-x-xs-s">
          <li>Link</li>
          <li>Link</li>
          <li>Link</li>
        </ul>
      </header>
      <h2 class="leading-[1.05]">Elegantly scale type and space without breakpoints</h2>
      <p class="~text-x1">Instead of tightening our grip by loading up on breakpoints, we can let go, embracing the ebb
        and flow with a more fluid and systematic approach to our design foundations</p>
      <ol
        class="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] [&>li]:bg-slate-500 [&>li]:text-slate-100 [&>li]:~p-s ~gap-s-l overflow-hidden">
        <li>
          Define type and space scales for a small screen
        </li>
        <li>
          Define type and space scales for a large screen
        </li>
        <li>
          Tell the browser to interpolate between the two scales, based on the current viewport width
        </li>
      </ol>
      <div class="!~mt-xl flex flex-col ~gap-3xs [&>span]:text-slate-300">
        <span>Step 5 <small>(~text-x5)</small></span>
        <h1>Heading 1</h1>
        <span>Step 4 <small>(~text-x4)</small></span>
        <h2>Heading 2</h2>
        <span>Step 3 <small>(~text-x3)</small></span>
        <h3>Heading 3</h3>
        <span>Step 2 <small>(~text-x2)</small></span>
        <h4>Heading 4</h4>
        <span>Step 1 <small>(~text-x1)</small></span>
        <h5>Heading 5</h5>
        <span>Step 0 <small>(~text-1)</small></span>
        <h6>Heading 6</h6>
      </div>
    </div>
  </div>
</div>`;

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
      utopia: {
        minScreen: "210px",
        minSize: 12.5,
        minScale: 1.2,
        maxScreen: "686px",
        maxSize: 15,
        maxScale: 1.333,
      }
      // ...
    },
  }
};`;
