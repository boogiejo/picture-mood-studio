import { DEFAULT_PICTURE_SETTINGS } from "./defaults";
import type { PictureSettings, PresetMap } from "./types";

/** The built-in picture presets. */
export const PICTURE_PRESETS: PresetMap = {
  Standard: {},
  Vivid: { brightness: 104, contrast: 115, saturation: 140, sharpness: 30 },
  Cinema: { brightness: 95, contrast: 110, gamma: 1.1, saturation: 90, warmth: 15, vignette: 35 },
  "Bright Room": { brightness: 112, contrast: 106, gamma: 0.85 },
  "Dark Room": { brightness: 85, contrast: 95, gamma: 1.2, warmth: 10 },
  "Night Light": { brightness: 80, warmth: 60, saturation: 85, gamma: 1.1 },
  Warm: { warmth: 40, saturation: 105 },
  Cool: { warmth: -40, tint: -5 },
  Anime: { saturation: 150, contrast: 112, sharpness: 50, brightness: 105 },
  Noir: { blackAndWhite: 100, contrast: 140, vignette: 50, gamma: 1.15 },
  Vintage: { sepia: 60, saturation: 80, contrast: 90, vignette: 40, soften: "Low", warmth: 20 },
};

function sameSettings(a: PictureSettings, b: PictureSettings): boolean {
  return (Object.keys(a) as (keyof PictureSettings)[]).every((key) => a[key] === b[key]);
}

/** The preset whose values the settings currently match, if any. */
export function matchPreset(settings: PictureSettings, presets: PresetMap): string | undefined {
  for (const [name, patch] of Object.entries(presets)) {
    if (sameSettings({ ...DEFAULT_PICTURE_SETTINGS, ...patch }, settings)) return name;
  }
  return undefined;
}

/** Full settings for a preset name; unknown names fall back to the defaults. */
export function resolvePreset(name: string, presets: PresetMap = PICTURE_PRESETS): PictureSettings {
  return { ...DEFAULT_PICTURE_SETTINGS, ...presets[name] };
}
