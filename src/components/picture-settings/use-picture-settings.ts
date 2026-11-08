import { useCallback, useMemo, useState } from "react";

import { CUSTOM_PRESET_NAME, DEFAULT_PICTURE_SETTINGS } from "./defaults";
import { matchPreset, PICTURE_PRESETS, resolvePreset } from "./presets";
import type { PictureSettings, PictureSettingsPatch, PresetMap } from "./types";

export type UsePictureSettingsOptions = {
  /** Controlled mode: pass the current settings in and listen to `onValueChange`. */
  value?: PictureSettings | undefined;
  /** Uncontrolled mode: the settings the panel starts on. */
  defaultValue?: PictureSettingsPatch | undefined;
  /** Preset name -> values. Defaults to the built-in `PICTURE_PRESETS`. */
  presets?: PresetMap | undefined;
  /** Called with the full settings object after every change. */
  onValueChange?: ((next: PictureSettings) => void) | undefined;
  /** Called with the active preset name after every change. */
  onPresetChange?: ((name: string) => void) | undefined;
};

export type UsePictureSettingsResult = {
  settings: PictureSettings;
  /** Name of the preset the settings match, or "Custom" after a manual change. */
  activePreset: string;
  /** Names in chip order. */
  presetNames: string[];
  /** Apply one or more values and mark the picture as custom. */
  patch: (next: PictureSettingsPatch) => void;
  /** Convenience wrapper for a single control. */
  setSetting: <K extends keyof PictureSettings>(key: K, next: PictureSettings[K]) => void;
  /** Apply a preset in full. */
  applyPreset: (name: string) => void;
  /** Restore every control to its default. */
  reset: () => void;
};

/**
 * Holds picture settings state, uncontrolled by default and controlled when
 * `value` is passed. The active preset name is tracked alongside the values.
 */
export function usePictureSettings(
  options: UsePictureSettingsOptions = {},
): UsePictureSettingsResult {
  const { value, defaultValue, presets = PICTURE_PRESETS, onValueChange, onPresetChange } = options;
  const controlled = value !== undefined;

  const [internal, setInternal] = useState<PictureSettings>(() => ({
    ...DEFAULT_PICTURE_SETTINGS,
    ...defaultValue,
  }));
  const [presetName, setPresetName] = useState<string>(
    () =>
      matchPreset({ ...DEFAULT_PICTURE_SETTINGS, ...defaultValue }, presets) ??
      CUSTOM_PRESET_NAME,
  );

  const settings = controlled ? value : internal;

  const commit = useCallback(
    (next: PictureSettings, name: string) => {
      if (!controlled) setInternal(next);
      setPresetName(name);
      onValueChange?.(next);
      onPresetChange?.(name);
    },
    [controlled, onValueChange, onPresetChange],
  );

  const patch = useCallback(
    (next: PictureSettingsPatch) => commit({ ...settings, ...next }, CUSTOM_PRESET_NAME),
    [commit, settings],
  );

  const setSetting = useCallback(
    <K extends keyof PictureSettings>(key: K, next: PictureSettings[K]) => {
      patch({ [key]: next } as PictureSettingsPatch);
    },
    [patch],
  );

  const applyPreset = useCallback(
    (name: string) => commit(resolvePreset(name, presets), name),
    [commit, presets],
  );

  const reset = useCallback(() => {
    const name = matchPreset(DEFAULT_PICTURE_SETTINGS, presets) ?? CUSTOM_PRESET_NAME;
    commit({ ...DEFAULT_PICTURE_SETTINGS }, name);
  }, [commit, presets]);

  const presetNames = useMemo(() => Object.keys(presets), [presets]);

  return { settings, activePreset: presetName, presetNames, patch, setSetting, applyPreset, reset };
}
