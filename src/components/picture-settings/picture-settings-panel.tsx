import { ArrowLeft } from "lucide-react";

import { cx } from "./cx";
import { RangeSlider, SegmentedControl, SettingsSection, SwitchRow } from "./primitives";
import type { FitMode, PictureSettings, PictureSettingsPatch, PresetMap, Soften } from "./types";

const SOFTEN_OPTIONS: { value: Soften; label: string }[] = (["Off", "Low", "Med", "High"] as Soften[]).map(
  (value) => ({ value, label: value }),
);

const FIT_OPTIONS: { value: FitMode; label: string }[] = [
  { value: "contain", label: "Whole picture" },
  { value: "cover", label: "Fill the screen" },
  { value: "fill", label: "Stretch" },
];

const percent = (value: number) => `${Math.round(value)}%`;
const signed = (value: number) => (value > 0 ? `+${value}` : `${value}`);
const degrees = (value: number) => `${signed(value)}°`;

export type PictureSettingsPanelProps = {
  settings: PictureSettings;
  /** Preset name shown in the header. */
  activePreset: string;
  presets: PresetMap;
  presetNames: string[];
  /** Apply values and mark the picture as custom. */
  onPatch: (next: PictureSettingsPatch) => void;
  onPreset: (name: string) => void;
  onReset: () => void;
  onBack?: (() => void) | undefined;
  /** Label beside the back arrow. */
  backLabel?: string;
  className?: string | undefined;
};

/** The column of controls: presets, light, color, detail, frame and reset. */
export function PictureSettingsPanel({
  settings,
  activePreset,
  presets,
  presetNames,
  onPatch,
  onPreset,
  onReset,
  onBack,
  backLabel = "Picture",
  className,
}: PictureSettingsPanelProps) {
  return (
    <aside className={cx("rounded-2xl bg-background p-3", className)}>
      <header className="flex items-center justify-between px-2 py-3">
        <button onClick={onBack} className="flex items-center gap-2 text-base">
          <ArrowLeft className="h-5 w-5" />
          {backLabel}
        </button>
        <span data-slot="picture-settings-preset-name" className="text-sm text-muted-foreground">
          {activePreset}
        </span>
      </header>

      <div className="flex flex-wrap gap-2 px-2 pb-4">
        {presetNames.map((name) => (
          <button
            key={name}
            onClick={() => onPreset(name)}
            aria-pressed={activePreset === name}
            className={cx(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              activePreset === name
                ? "border-foreground bg-foreground font-semibold text-background ring-2 ring-foreground ring-offset-2 ring-offset-background"
                : "border-border hover:border-muted-foreground",
            )}
          >
            {name}
          </button>
        ))}
      </div>

      <SettingsSection title="LIGHT">
        <RangeSlider
          label="Brightness"
          value={settings.brightness}
          min={0}
          max={200}
          format={percent}
          onChange={(brightness) => onPatch({ brightness })}
        />
        <RangeSlider
          label="Contrast"
          value={settings.contrast}
          min={0}
          max={200}
          format={percent}
          onChange={(contrast) => onPatch({ contrast })}
        />
        <RangeSlider
          label="Gamma"
          value={settings.gamma}
          min={0.1}
          max={3}
          step={0.05}
          format={(value) => value.toFixed(2)}
          onChange={(gamma) => onPatch({ gamma })}
        />
      </SettingsSection>

      <SettingsSection title="COLOR">
        <RangeSlider
          label="Saturation"
          value={settings.saturation}
          min={0}
          max={200}
          format={percent}
          onChange={(saturation) => onPatch({ saturation })}
        />
        <RangeSlider
          label="Warmth"
          value={settings.warmth}
          min={-100}
          max={100}
          format={signed}
          onChange={(warmth) => onPatch({ warmth })}
        />
        <RangeSlider
          label="Tint"
          value={settings.tint}
          min={-100}
          max={100}
          format={signed}
          onChange={(tint) => onPatch({ tint })}
        />
        <RangeSlider
          label="Hue"
          value={settings.hue}
          min={-180}
          max={180}
          format={degrees}
          onChange={(hue) => onPatch({ hue })}
        />
        <RangeSlider
          label="Black and White"
          value={settings.blackAndWhite}
          min={0}
          max={100}
          format={percent}
          onChange={(blackAndWhite) => onPatch({ blackAndWhite })}
        />
        <RangeSlider
          label="Sepia"
          value={settings.sepia}
          min={0}
          max={100}
          format={percent}
          onChange={(sepia) => onPatch({ sepia })}
        />
      </SettingsSection>

      <SettingsSection title="DETAIL">
        <RangeSlider
          label="Sharpness"
          value={settings.sharpness}
          min={0}
          max={100}
          format={percent}
          onChange={(sharpness) => onPatch({ sharpness })}
        />
        <div className="py-2.5">
          <div className="mb-2 text-sm">Soften</div>
          <SegmentedControl
            options={SOFTEN_OPTIONS}
            value={settings.soften}
            onChange={(soften) => onPatch({ soften })}
          />
        </div>
        <RangeSlider
          label="Vignette"
          value={settings.vignette}
          min={0}
          max={100}
          format={percent}
          onChange={(vignette) => onPatch({ vignette })}
        />
      </SettingsSection>

      <SettingsSection title="FRAME">
        <RangeSlider
          label="Zoom"
          value={settings.zoom}
          min={50}
          max={300}
          format={percent}
          onChange={(zoom) => onPatch({ zoom })}
        />
        <div className="py-2.5">
          <div className="mb-2 text-sm">Fit Mode</div>
          <SegmentedControl options={FIT_OPTIONS} value={settings.fit} onChange={(fit) => onPatch({ fit })} />
        </div>
        <SwitchRow
          label="Mirror"
          description="Left/Right swapped"
          on={settings.mirror}
          onChange={(mirror) => onPatch({ mirror })}
        />
        <SwitchRow
          label="Upside Down"
          description="180° rotate"
          on={settings.flip}
          onChange={(flip) => onPatch({ flip })}
        />
        <SwitchRow
          label="Ambient Mode"
          description="Glow around the picture"
          on={settings.ambient}
          onChange={(ambient) => onPatch({ ambient })}
        />
      </SettingsSection>

      <div className="border-t border-border px-2 pt-4 pb-2">
        <button
          onClick={onReset}
          className="w-full rounded-full border border-border py-2.5 text-sm font-semibold transition-colors hover:bg-foreground hover:text-background"
        >
          Reset the Picture
        </button>
      </div>
    </aside>
  );
}
