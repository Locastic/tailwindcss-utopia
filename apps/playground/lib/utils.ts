import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const html = String.raw;
export const css = String.raw;
export const js = String.raw;

export function generateSrcDoc(
  html_: string | undefined,
  css: string | undefined,
) {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html_}
      </body>
    </html>
  `;
}
