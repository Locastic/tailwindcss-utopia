import { validators } from "tailwind-merge";

const tshirtUnitRegex = /^(\d*xs|xs|s|m|l|xl|\d*xl)$/;

function isRange(value: string) {
  if (!value.startsWith("[") || !value.endsWith("]")) return false;

  value = value.slice(1, -1);

  const parts = value.split("/");

  if (parts.length < 1 || parts.length > 2) return false;

  if (parts.length === 1) {
    return validators.isNumber(parts[0]);
  } else if (parts.length === 2) {
    const [a, b] = parts;

    return (
      (a === "" || validators.isNumber(a)) &&
      (b === "" || validators.isNumber(b))
    );
  }

  return false;
}

function isStep(value: string) {
  return (
    value === "1" ||
    (value !== "x0" &&
      value.startsWith("x") &&
      validators.isNumber(value.slice(1)))
  );
}

function isArbitraryStep(value: string) {
  return (
    (value.startsWith("[x") &&
      value.endsWith("]") &&
      validators.isNumber(value.slice(2, -1))) ||
    isRange(value)
  );
}

function isSpace(value: string) {
  return tshirtUnitRegex.test(value);
}

function isArbitrarySpace(value: string) {
  return isRange(value);
}

export { isStep, isArbitraryStep, isSpace, isArbitrarySpace };
