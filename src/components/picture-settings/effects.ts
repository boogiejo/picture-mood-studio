import { DEFAULT_PICTURE_SETTINGS } from "./defaults";
import type { PictureSettings, PresetMap, Soften } from "./types";

/** Blur strength per soften level, in CSS pixels. */
export const SOFTEN_BLUR_PX: Record<Soften, number> = {
  Off: 0,
  Low: 0.6,
  Med: 1.4,
  High: 2.6,
};

/**
 * Gamma has no CSS equivalent, so it is approximated with a brightness/contrast
 * curve: values below 1 lift the middle tones, values above 1 push them down.
 */
export function gammaCurve(gamma: number): { brightness: number; contrast: number } {
  return {
    brightness: Math.pow(1 / gamma, 0.35),
    contrast: Math.pow(gamma, 0.15),
  };
}

/** The CSS `filter` value that renders the light, color and detail settings. */
export function buildFilter(settings: PictureSettings): string {
  const curve = gammaCurve(settings.gamma);
  const sharpnessBoost = 1 + (settings.sharpness / 100) * 0.15;
  const blur = SOFTEN_BLUR_PX[settings.soften];

  return [
    `brightness(${((settings.brightness / 100) * curve.brightness).toFixed(3)})`,
    `contrast(${((settings.contrast / 100) * curve.contrast * sharpnessBoost).toFixed(3)})`,
    `saturate(${settings.saturation / 100})`,
    `hue-rotate(${settings.hue}deg)`,
    `sepia(${settings.sepia / 100})`,
    `grayscale(${settings.blackAndWhite / 100})`,
    blur ? `blur(${blur}px)` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/** The CSS `transform` value that renders zoom, mirror and upside down. */
export function buildTransform(settings: PictureSettings): string {
  return [
    `scale(${settings.zoom / 100})`,
    `scaleX(${settings.mirror ? -1 : 1})`,
    `scaleY(${settings.flip ? -1 : 1})`,
  ].join(" ");
}

/** Warmth has no CSS filter, so it is painted as a soft-light color layer. */
export function buildWarmthOverlay(warmth: number): string {
  const hue = warmth >= 0 ? 60 : 250;
  return `oklch(0.7 0.2 ${hue} / ${(Math.abs(warmth) / 100) * 0.25})`;
}

/** Tint has no CSS filter, so it is painted as a soft-light color layer. */
export function buildTintOverlay(tint: number): string {
  const hue = tint >= 0 ? 330 : 145;
  return `oklch(0.7 0.2 ${hue} / ${(Math.abs(tint) / 100) * 0.2})`;
}

/** Vignette as an inset shadow around the inside edge of the frame. */
export function buildVignette(vignette: number): string {
  return `inset 0 0 ${vignette * 2.4}px ${vignette * 1.2}px oklch(0 0 0 / ${vignette / 100})`;
}

/** Everything the preview needs, computed from the settings. */
export function buildPictureEffects(settings: PictureSettings) {
  return {
    filter: buildFilter(settings),
    transform: buildTransform(settings),
    objectFit: settings.fit,
    warmthOverlay: buildWarmthOverlay(settings.warmth),
    tintOverlay: buildTintOverlay(settings.tint),
    vignette: buildVignette(settings.vignette),
  };
}
