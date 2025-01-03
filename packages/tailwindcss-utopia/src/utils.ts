const lengthUnits = [
  "cm",
  "mm",
  "Q",
  "in",
  "pc",
  "pt",
  "px",
  "em",
  "ex",
  "ch",
  "rem",
  "lh",
  "rlh",
];
const lengthRegExp = new RegExp(
  `^\s*([+-]?[0-9]*\.?[0-9]+(?:[eE][+-]?[0-9]+)?)(${lengthUnits.join("|")})\s*$`,
);

export const length = (value: unknown) => {
  return typeof value === "string" && lengthRegExp.test(value);
};

export const getCommentFromClamp = (clamp: string) => {
  const matches = clamp.match(/clamp\(([^)]+)\)/);
  if (!matches || !matches[1]) {
    return "";
  }

  const params = matches[1];

  const [p1, _p2, p3] = params.split(",");

  if (!p1 || !p3) {
    return "";
  }

  const fs1 = Number(p1.replace("rem", "")) * 16;
  const fs2 = Number(p3.replace("rem", "")) * 16;

  if (Number.isNaN(fs1) || Number.isNaN(fs2)) {
    return "";
  }

  return `/* ${fs1} → ${fs2} */`;
};

export const negateValue = (value: string) => {
  value = value.replace(/((var|clamp)\([^)]*\))/g, "calc($& * -1)");

  return value.replace(/\/\*([\s\S]*?)\*\//g, (comment) => {
    return comment.replace(/-?\d+\.?\d*/g, (num) => {
      return String(-parseFloat(num));
    });
  });
};
