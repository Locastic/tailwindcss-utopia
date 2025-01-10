import { mergeConfigs, validators, type Config } from "tailwind-merge";

import {
  isArbitrarySpace,
  isArbitraryStep,
  isSpace,
  isStep,
} from "./validators";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export function withUtopia(config: Config<string, string>) {
  type ClassGroupKeys = keyof typeof config.classGroups;
  type ClassGroup = (typeof config.classGroups)[ClassGroupKeys];
  type ClassDefinition = ArrayElement<ClassGroup>;
  interface ThemeGetter {
    (theme: (typeof config)["theme"]): ClassGroup;
    isThemeGetter: true;
  }

  const isThemeGetter = (def: ClassDefinition): def is ThemeGetter =>
    typeof def === "function" && "isThemeGetter" in def && def.isThemeGetter;

  const resolveThemeGetters = (
    group: ClassGroup,
  ): Exclude<ClassDefinition, ThemeGetter>[] =>
    group.flatMap((def) =>
      isThemeGetter(def) ? resolveThemeGetters(def(config.theme)) : [def],
    );

  const classGroups = Object.entries(config.classGroups)
    .filter(
      ([_name, group]) => group.length !== 0 && typeof group[0] !== "string",
    )
    .filter(([_name, group]) => {
      const classGroup = Object.values(group[0])[0] as ClassGroup;

      const resolvedClassGroup = resolveThemeGetters(classGroup);

      return resolvedClassGroup.some(
        (def) =>
          def === validators.isLength || def === validators.isArbitraryLength,
      );
    })
    .reduce((acc, [name, group]) => {
      const groupName = Object.keys(group[0])[0];

      const classGroup =
        groupName === "text"
          ? [{ [`~${groupName}`]: [isStep, isArbitraryStep] }]
          : [
              { [`~${groupName}`]: [isSpace, isArbitrarySpace] },
              { [`~-${groupName}`]: [isSpace, isArbitrarySpace] },
            ];

      return {
        ...acc,
        [name]: classGroup,
      };
    }, {});

  return mergeConfigs(config, {
    extend: {
      classGroups,
    },
  });
}
