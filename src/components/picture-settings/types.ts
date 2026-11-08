/** Soften levels available in the DETAIL section. */
export type Soften = "Off" | "Low" | "Med" | "High";

/** How the picture fills its frame: whole picture, fill the screen, or stretch. */
export type FitMode = "contain" | "cover" | "fill";

/** Every value the picture settings panel controls. */
export type PictureSettings = {
  /** Percent, 0-200, default 100. */
  brightness: number;
  /** Percent, 0-200, default 100. */
  contrast: number;
  /** Midtone curve, 0.1-3, default 1. Below 1 lifts the middle tones. */
  gamma: number;
  /** Percent, 0-200, default 100. */
  saturation: number;
  /** Orange/blue shift, -100 to 100, default 0. */
  warmth: number;
  /** Pink/green shift, -100 to 100, default 0. */
  tint: number;
  /** Hue rotation in degrees, -180 to 180, default 0. */
  hue: number;
  /** Percent of black and white, 0-100, default 0. */
  blackAndWhite: number;
  /** Percent of sepia, 0-100, default 0. */
  sepia: number;
  /** Percent, 0-100, default 0. */
  sharpness: number;
  /** Blur strength applied to the picture. */
  soften: Soften;
  /** Percent of darkened edges, 0-100, default 0. */
  vignette: number;
  /** Percent, 50-300, default 100. */
  zoom: number;
  /** How the picture fills its frame. */
  fit: FitMode;
  /** Left/right swapped. */
  mirror: boolean;
  /** Rotated 180 degrees. */
  flip: boolean;
  /** Soft glow of the picture's colors around the frame. */
  ambient: boolean;
};

/** A partial change to the settings, used by presets and by `patch`. */
export type PictureSettingsPatch = Partial<PictureSettings>;

/** Preset name -> the values it applies. Missing keys fall back to the defaults. */
export type PresetMap = Record<string, PictureSettingsPatch>;
