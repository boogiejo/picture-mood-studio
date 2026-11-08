import type { PictureSettings } from "./types";

/** The baseline every control returns to when the picture is reset. */
export const DEFAULT_PICTURE_SETTINGS: PictureSettings = {
  brightness: 100,
  contrast: 100,
  gamma: 1,
  saturation: 100,
  warmth: 0,
  tint: 0,
  hue: 0,
  blackAndWhite: 0,
  sepia: 0,
  sharpness: 0,
  soften: "Off",
  vignette: 0,
  zoom: 100,
  fit: "contain",
  mirror: false,
  flip: false,
  ambient: false,
};

/** Shown in the header once a control is moved by hand. */
export const CUSTOM_PRESET_NAME = "Custom";
