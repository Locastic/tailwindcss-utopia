import { mergeConfigs, type Config } from "tailwind-merge";

export function withUtopia(config: Config<string, string>) {
	const classGroups = Object.entries(config.classGroups)
		.filter(
			([_name, group]) => group.length !== 0 && typeof group[0] !== "string",
		)
		.reduce((acc, [name, group]) => {
			const groupName = Object.keys(group[0])[0];
			const def = [(val: any) => !!val];

			return {
				...acc,
				[name]: [{ [`~${groupName}`]: def }, { [`~-${groupName}`]: def }],
			};
		}, {});

	return mergeConfigs(config, {
		extend: {
			classGroups,
		},
	});
}
