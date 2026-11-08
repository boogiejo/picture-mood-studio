import type { CSSProperties, ReactNode } from "react";

import { cx } from "./cx";
import "./picture-settings.css";

/** A titled group of controls, separated from the group above by a rule. */
export function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border px-2 pt-4 pb-2">
      <h3 className="mb-1 text-xs font-semibold tracking-widest text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

/** A labelled range control with its current value shown on the right. */
export function RangeSlider({
  label,
  value,
  min,
  max,
  step = 1,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format: (value: number) => string;
  onChange: (value: number) => void;
}) {
  const fill = ((value - min) / (max - min)) * 100;

  return (
    <div className="py-2.5">
      <div className="mb-2 flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground tabular-nums">{format(value)}</span>
      </div>
      <input
        type="range"
        className="panel-range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--fill": `${fill}%` } as CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={label}
      />
    </div>
  );
}

/** A labelled on/off switch with an optional second line of copy. */
export function SwitchRow({
  label,
  description,
  on,
  onChange,
}: {
  label: string;
  description?: string | undefined;
  on: boolean;
  onChange: (on: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="flex w-full items-center justify-between py-2.5 text-left"
      role="switch"
      aria-checked={on}
    >
      <span className="text-sm">
        {label}
        {description && <span className="block text-xs text-muted-foreground">{description}</span>}
      </span>
      <span
        className={cx(
          "relative h-6 w-11 rounded-full transition-colors",
          on ? "bg-foreground" : "bg-muted",
        )}
      >
        <span
          className={cx(
            "absolute top-1 h-4 w-4 rounded-full transition-all",
            on ? "left-6 bg-background" : "left-1 bg-foreground",
          )}
        />
      </span>
    </button>
  );
}

/** A pill of mutually exclusive choices. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex rounded-full border border-border p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={cx(
            "flex-1 rounded-full px-2 py-1.5 text-xs transition-colors",
            value === option.value
              ? "bg-foreground font-semibold text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
