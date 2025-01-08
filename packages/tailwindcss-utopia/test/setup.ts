import { expect } from "bun:test";
import prettier from "prettier";
import { diff } from "jest-diff";

function format(input: string) {
  return prettier.format(input.replace(/\n/g, ""), {
    parser: "css",
    printWidth: 100,
  });
}
function stripped(str: string) {
  return str
    .replace(/\/\* ! tailwindcss .* \*\//, "")
    .replace(/\s/g, "")
    .replace(/;/g, "");
}

expect.extend({
  // Compare two CSS strings with all whitespace removed
  // This is probably naive but it's fast and works well enough.
  async toMatchFormattedCss(received = "", argument = "") {
    if (typeof received !== "string") throw new Error("Invalid usage");

    let formattedReceived = await format(received);
    let formattedArgument = await format(argument);

    const pass = stripped(formattedReceived) === stripped(formattedArgument);

    const message = pass
      ? () => {
          return (
            `Expected: not ${this.utils.printExpected(formattedReceived)}\n` +
            `Received: ${this.utils.printReceived(formattedArgument)}`
          );
        }
      : () => {
          const actual = formattedReceived;
          const expected = formattedArgument;

          const diffString = diff(expected, actual);

          return diffString && diffString.includes("- Expect")
            ? diffString
            : `Expected: ${this.utils.printExpected(expected)}\n` +
                `Received: ${this.utils.printReceived(actual)}`;
        };

    return { actual: received, message, pass };
  },
});
