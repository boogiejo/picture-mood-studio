import { cx } from "./cx";
import { PicturePreview } from "./picture-preview";
import { PictureSettingsPanel } from "./picture-settings-panel";
import { usePictureSettings } from "./use-picture-settings";
import type { PictureSettings, PictureSettingsPatch, PresetMap } from "./types";

export type PictureSettingsControlProps = {
  /** Picture to tune: a URL, or a bundled asset import. */
  imageSrc: string;
  imageAlt?: string | undefined;
  /** Controlled mode: pass the current settings and listen to `onValueChange`. */
  value?: PictureSettings | undefined;
  /** Uncontrolled mode: the settings the panel starts on. */
  defaultValue?: PictureSettingsPatch | undefined;
  /** Preset name -> values. Defaults to the built-in `PICTURE_PRESETS`. */
  presets?: PresetMap | undefined;
  onValueChange?: ((next: PictureSettings) => void) | undefined;
  onPresetChange?: ((name: string) => void) | undefined;
  /** Back arrow action. Omit to keep the header label inert. */
  onBack?: (() => void) | undefined;
  backLabel?: string;
  /** Extra classes on the outer layout. */
  className?: string | undefined;
  /** Extra classes on the frame that clips the picture. */
  previewClassName?: string | undefined;
};

/**
 * The full picture settings screen: the picture on the left, the controls on the
 * right. Owns its state unless `value` is passed in.
 */
export function PictureSettingsControl({
  imageSrc,
  imageAlt,
  value,
  defaultValue,
  presets,
  onValueChange,
  onPresetChange,
  onBack,
  backLabel,
  className,
  previewClassName,
}: PictureSettingsControlProps) {
  const { settings, activePreset, presetNames, patch, applyPreset, reset } = usePictureSettings({
    value,
    defaultValue,
    presets,
    onValueChange,
    onPresetChange,
  });

  return (
    <div className={cx("mx-auto grid max-w-6xl gap-8 p-6 lg:grid-cols-[1fr_380px]", className)}>
      <PicturePreview src={imageSrc} alt={imageAlt} settings={settings} className={previewClassName} />
      <PictureSettingsPanel
        settings={settings}
        activePreset={activePreset}
        presetNames={presetNames}
        onPatch={patch}
        onPreset={applyPreset}
        onReset={reset}
        onBack={onBack}
        backLabel={backLabel}
      />
    </div>
  );
}
