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

    const options = {
      comment: "stripped(received) === stripped(argument)",
      isNot: this.isNot,
      promise: this.promise,
    };

    let formattedReceived = await format(received);
    let formattedArgument = await format(argument);

    const pass = stripped(formattedReceived) === stripped(formattedArgument);

    const message = pass
      ? () => {
          return (
            this.utils.matcherHint(
              "toMatchFormattedCss",
              undefined,
              undefined,
              options,
            ) +
            "\n\n" +
            `Expected: not ${this.utils.printExpected(formattedReceived)}\n` +
            `Received: ${this.utils.printReceived(formattedArgument)}`
          );
        }
      : () => {
          const actual = formattedReceived;
          const expected = formattedArgument;

          const diffString = diff(expected, actual);

          return (
            this.utils.matcherHint(
              "toMatchFormattedCss",
              undefined,
              undefined,
              options,
            ) +
            "\n\n" +
            (diffString && diffString.includes("- Expect")
              ? `Difference:\n\n${diffString}`
              : `Expected: ${this.utils.printExpected(expected)}\n` +
                `Received: ${this.utils.printReceived(actual)}`)
          );
        };

    return { actual: received, message, pass };
  },
});
