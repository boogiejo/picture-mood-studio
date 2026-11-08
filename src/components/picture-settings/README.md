# Picture Settings

A dark-mode picture settings panel: preset chips, light / color / detail / frame
controls, and a live preview that renders every value with plain CSS.

## Install

Copy this folder into your project (it has no internal imports outside itself):

```
src/components/picture-settings/
```

Dependencies:

- `react` 18 or 19
- `lucide-react` — the back arrow only
- Tailwind CSS v4 with the shadcn color tokens (`--background`, `--foreground`,
  `--muted`, `--muted-foreground`, `--border`, `--ring`) used by the class names

No slider, switch, or dialog library is needed — the controls are hand-rolled.
The slider track styling lives in `picture-settings.css` and is imported by
`primitives.tsx`, so it comes along automatically.

## Use

```tsx
import { PictureSettingsControl } from "@/components/picture-settings";

<PictureSettingsControl imageSrc={photo} defaultValue={PICTURE_PRESETS["Bright Room"]} />;
```

## API

| Prop            | Type                                       | Notes                                              |
| --------------- | ------------------------------------------ | -------------------------------------------------- |
| `imageSrc`      | `string`                                   | required                                           |
| `imageAlt`      | `string`                                   | defaults to "Picture preview"                      |
| `defaultValue`  | `Partial<PictureSettings>`                 | uncontrolled start point                           |
| `value`         | `PictureSettings`                          | controlled mode, pair with `onValueChange`         |
| `onValueChange` | `(next: PictureSettings) => void`          | fires after every change                           |
| `onPresetChange`| `(name: string) => void`                   | fires with the active preset name                  |
| `presets`       | `Record<string, Partial<PictureSettings>>` | replaces the built-in `PICTURE_PRESETS`            |
| `onBack`        | `() => void`                               | back arrow action                                  |
| `backLabel`     | `string`                                   | header label, defaults to "Picture"                |
| `className`     | `string`                                   | outer layout                                       |
| `previewClassName` | `string`                                | the frame clipping the picture                     |

## Building blocks

- `usePictureSettings(options)` — state only, no markup. Returns `settings`,
  `activePreset`, `presetNames`, `patch`, `setSetting`, `applyPreset`, `reset`.
- `PicturePreview` — the framed picture with the effects applied.
- `PictureSettingsPanel` — the column of controls.
- `RangeSlider`, `SwitchRow`, `SegmentedControl`, `SettingsSection` — the
  primitives the panel is built from.
- `buildFilter` / `buildTransform` / `buildPictureEffects` — pure functions that
  turn settings into CSS, so you can apply the same look to your own element.

## Behavior

- Applying a preset sets every control at once and shows its name top right.
- Moving any control by hand switches the name to "Custom".
- "Reset the Picture" restores every default and names the picture "Standard".
- Gamma has no CSS equivalent, so it is approximated with a brightness/contrast
  curve; warmth and tint are soft-light color layers; sharpness adds contrast.
