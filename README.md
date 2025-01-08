# tailwindcss-utopia

A TailwindCSS plugin for the utopia fluid design system

## Install

TODO

## Features

- clamp based
- compatible with the utopia config
- `tailwindcss-merge` support

### default values

Because of the configuration utopia provides, values in this plugin are divided into two categories:

- font-size values
- spacing values

For font size values, utility classes are generated from the utopia configuration `negativeSteps` & `positiveSteps`, so we kept using the default configuration, the following will be generated:

- `~text-x5`, `~text-x4`, `~text-x3`, `~text-x2`, `~text-x1`, `~text-1`, `~text-x-1`, `~text-x-2`: basically meaning that the size is the base size multiplied by scale x times, `text-1` means `text-x0`.

Note that with font size utility, you cannot use the negative variant.

Now as for the spacing values, it's much clearer, so as usual for the default config, we'll have:

- `~inset-3xs` .. `~inset-3xl`, `~inset-3xs-2xs` .. `~inset-2xl-3xl`, `~inset-s-l`

Also, you can always use the negative variant for spacing utilities, like for example `~-inset-m-l`.

### arbitrary values

The plugin does also support setting arbitrary values, and the same thing goes here as in the default values, but here both categories have a shared format of arbitrary values, so let's say for either `~inset-[value]` or `~text-[value]`, the format of the value could be:

- `[max]`: the value provided will be the maximum the fluid size could reach, the minimum value will be calculated accordingly.
- `[/max]`: same as above.
- `[min/]`: the value provided will be the minimun the fluid size could reach, the maximum value will be calculated accordingly.
- `[min/max]`: a basic clamp function between min and max will be provided.

Values can also be negative, but just for spacing utilities, and in this case if one of the values are provided (but not both), the calculation will be inverted so that the max of the clamp is always greater than the min.

But if you choose to use the negative utility class instead (`~-inset-[value]`), the clamp will be wrapped by a `calc(clamp(...) * -1)`, basically inverting both side of the clamp.

Now the extra format that the font size utility has, is setting a custom scale multiplier like the following:

- `[x2]`: which means, both min and max will be the base size multiplied twice by the scale, which will be the same as `~text-x2`
- `[x-4]`: here, the size will be base size divided 4 times by the scale, which is the same as `~text-x-4` if you set the `negativeSteps` in utopia config to `4` or more.

## Config

By default the utopia entry in tailwindcss config is as follows:

```ts
{
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
}
```

You can extend any value in your `tailwindcss.config.ts` file, like the following example:

```ts
{
  theme: {
    extend: {
      utopia: {
        minSize: 16,
        maxSize: 18,
        maxScale: 1.333,
        spacingPairs: ["3xs-s", "s-l", "m-3xl"],
      },
    }
  }
}
```

## tailwind-merge

Along with the tailwindcss plugin, we provide a custom tailwind-merge configuration.

## Credits

- utopia-core
- fluid.tw
