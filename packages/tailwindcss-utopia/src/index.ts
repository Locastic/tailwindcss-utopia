import plugin from "tailwindcss/plugin";
import { PluginAPI, PluginCreator } from "tailwindcss/types/config";
import { corePlugins } from "tailwindcss-priv/src/corePlugins";
import {
	calculateSpaceScale,
	calculateTypeScale,
	calculateClamp,
} from "utopia-core";

import { getCommentFromClamp, length, negateValue } from "./utils";

// TODO: fix bug where negative utility classes still get generated even if not used!

type MatchUtil = PluginAPI["matchUtilities"];

const utopiaCustom = plugin(
	(api) => {
		textSizes(api);
		spacings(api);
	},
	{
		theme: {
			utopia: {
				minScreen: "320px",
				minSize: 18,
				minScale: 1.2,
				maxScreen: "1240px",
				maxSize: 20,
				maxScale: 1.25,
				positiveSteps: 5,
				negativeSteps: 2,
				spacingSteps: {
					negative: [0.75, 0.5, 0.25],
					positive: [1.5, 2, 3, 4, 6],
				},
				spacingPairs: ["s-l"],
			},
		},
	},
);

const textSizes: PluginCreator = ({ addBase, matchUtilities, theme }) => {
	const minWidth = Number(theme("utopia.minScreen", "").replace("px", ""));
	const minSize = Number(theme("utopia.minSize"));
	const minScale = Number(theme("utopia.minScale"));

	const maxWidth = Number(theme("utopia.maxScreen", "").replace("px", ""));
	const maxSize = Number(theme("utopia.maxSize"));
	const maxScale = Number(theme("utopia.maxScale"));

	const negativeSteps = Number(theme("utopia.negativeSteps"));
	const positiveSteps = Number(theme("utopia.positiveSteps"));

	const root: Record<string, string> = {};
	const css = {
		":root": root,
	};

	const typeScale = calculateTypeScale({
		minWidth,
		minFontSize: minSize,
		minTypeScale: minScale,
		maxWidth,
		maxFontSize: maxSize,
		maxTypeScale: maxScale,
		negativeSteps,
		positiveSteps,
	});

	const utopianTypeValues = typeScale.reduce(
		(values, { label, clamp }) => {
			root[`--step-${label}`] = clamp;

			const name =
				label === "0" ? "1" : +label < 0 ? `1/x${+label * -1}` : `x${label}`;

			values[name] = `var(--step-${label}) ${getCommentFromClamp(clamp)}`;

			return values;
		},
		{} as Record<string, string>,
	);

	const textFn = (value: string) => {
		return {
			fontSize: value,
		};
	};

	addBase(css);
	matchUtilities(
		{
			//@ts-expect-error wrong util return type
			"~text": (value: string) => {
				if (value.includes("var(--step-")) {
					return {
						fontSize: value,
					};
				}

				if (!value) {
					return;
				}

				let min: number | undefined;
				let max: number | undefined;
				let step: number | undefined;

				if (!Number.isNaN(Number(value))) {
					// TODO: add default param to choose between min or max
					max = Number(value);
				} else {
					if (value.includes("1/x")) {
						value = value.replace("1/x", "");
						step = Number(value) * -1;
					} else if (value.includes("x")) {
						value = value.replace("x", "");
						step = Number(value);
					} else {
						const [fs1, fs2] = value.split("/");

						if (fs1) {
							min = Number(fs1);
						}

						if (fs2) {
							max = Number(fs2);
						}
					}
				}

				if (Number.isNaN(step) || Number.isNaN(min) || Number.isNaN(max)) {
					return;
				}

				if (step !== undefined) {
					min = minSize * Math.pow(minScale, step);
					max = maxSize * Math.pow(maxScale, step);
				} else if (min === undefined || max === undefined) {
					if (min !== undefined) {
						step = Math.log(min / minSize) / Math.log(minScale);
						max = maxSize * Math.pow(maxScale, step);
					} else if (max !== undefined) {
						step = Math.log(max / maxSize) / Math.log(maxScale);
						min = minSize * Math.pow(minScale, step);
					}
				}

				if (Number.isNaN(min) || Number.isNaN(max)) {
					return;
				}

				const clamp = calculateClamp({
					minWidth,
					maxWidth,
					minSize: min!,
					maxSize: max!,
				});

				return textFn(`${clamp} ${getCommentFromClamp(clamp)}`);
			},
		},
		{
			values: utopianTypeValues,
			supportsNegativeValues: false,
			respectPrefix: false,
		},
	);
};

const spacings: PluginCreator = (api) => {
	const { addBase, theme, corePlugins: corePluginEnabled } = api;

	const minWidth = Number(theme("utopia.minScreen", "").replace("px", ""));
	const minSize = Number(theme("utopia.minSize"));

	const maxWidth = Number(theme("utopia.maxScreen", "").replace("px", ""));
	const maxSize = Number(theme("utopia.maxSize"));
	const spacings: { positive: number[]; negative: number[] } = theme(
		"utopia.spacingSteps",
		{
			negative: [],
			positive: [],
		},
	);
	const pairs: string[] = theme("utopia.spacingPairs", []);

	const root: Record<string, string> = {};
	const css = {
		":root": root,
	};

	const spaceScale = calculateSpaceScale({
		minWidth,
		minSize,
		maxWidth,
		maxSize,
		negativeSteps: spacings.negative,
		positiveSteps: spacings.positive,
		customSizes: pairs,
	});

	const utopianSpaceValues = [
		...spaceScale.sizes,
		...spaceScale.oneUpPairs,
		...spaceScale.customPairs,
	].reduce(
		(values, { label, clamp }) => {
			root[`--space-${label}`] = clamp;

			values[label] = `var(--space-${label}) ${getCommentFromClamp(clamp)}`;

			return values;
		},
		{} as Record<string, string>,
	);

	addBase(css);

	const getUtopiaAPI = (api: PluginAPI) => {
		const withUtopia =
			(orig: MatchUtil): MatchUtil =>
			(utilities, options) => {
				if (
					options?.type &&
					!options.type.includes("line-width") &&
					!options.type.includes("length") &&
					!options.type.includes("any")
				)
					return;

				// NOTE: text utilities are handled elsewhere
				if (Object.keys(utilities).includes("text")) return;

				if (
					!options?.values ||
					!Object.values(options.values).some((value) => length(value))
				) {
					return;
				}

				let { type } = options;

				const values = utopianSpaceValues;

				if (
					Object.keys(utilities).some((util) => util.includes("border")) &&
					Array.isArray(type)
				) {
					type = [...type, "any"];
				}

				Object.entries(utilities).forEach(([util, origFn]) => {
					const process = (value: string, negate = false) => {
						if (typeof value === "string" && value.includes("var(--space-")) {
							return origFn(!negate ? value : negateValue(value), {
								modifier: null,
							});
						}

						if (!value) {
							return;
						}

						let min: number | undefined;
						let max: number | undefined;

						if (typeof value === "string" && !Number.isNaN(Number(value))) {
							// TODO: add default param to choose between min or max
							max = Number(value);
						} else {
							const [sp1, sp2] = value.split("/");

							if (sp1) {
								min = Number(sp1);
							}

							if (sp2) {
								max = Number(sp2);
							}
						}

						if (Number.isNaN(min) || Number.isNaN(max)) {
							return;
						}

						if (min === undefined && max !== undefined) {
							if (max > 0) {
								min = (minSize * max) / maxSize;
							} else {
								min = (maxSize * max) / minSize;
							}
						}

						if (min !== undefined && max === undefined) {
							if (min > 0) {
								max = (maxSize * min) / minSize;
							} else {
								max = (minSize * min) / maxSize;
							}
						}

						const clamp = calculateClamp({
							minWidth,
							maxWidth,
							minSize: min!,
							maxSize: max!,
						});

						const clampedValue = `${clamp} ${getCommentFromClamp(clamp)}`;

						return origFn(!negate ? clampedValue : negateValue(clampedValue), {
							modifier: null,
						});
					};

					orig(
						//@ts-expect-error wrong util return type
						{
							[`~${util}`]: (value: string) => process(value, false),
						},
						{
							...options,
							supportsNegativeValues: false,
							values,
							type,
						},
					);

					if (!options.supportsNegativeValues) return;

					orig(
						//@ts-expect-error wrong util return type
						{
							[`~-${util}`]: (value: string) => process(value, true),
						},
						{
							...options,
							supportsNegativeValues: false,
							values,
							type,
						},
					);
				});
			};

		const noop = () => {};

		return {
			...api,
			addUtilities: noop,
			addComponents: noop,
			addVariant: noop,
			addBase: noop,
			matchVariant: noop,
			addDefaults: noop,
			matchUtilities: withUtopia(api.matchUtilities),
			matchComponents: noop,
		};
	};

	Object.entries(corePlugins).forEach(([name, corePlugin]) => {
		if (name === "preflight" || !corePluginEnabled(name)) return;

		const utopiaCoreAPI = getUtopiaAPI(api);

		corePlugin(utopiaCoreAPI);
	});
};

export { default as extract } from "./extractor";

export default utopiaCustom;
