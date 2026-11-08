import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import preview from "@/assets/preview.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Picture Settings" },
      { name: "description", content: "Interactive picture settings panel with presets, color, detail and frame controls." },
      { property: "og:title", content: "Picture Settings" },
      { property: "og:description", content: "Tune brightness, color, detail and framing with live preview." },
    ],
  }),
  component: Index,
});

type Soften = "Off" | "Low" | "Med" | "High";
type Fit = "contain" | "cover" | "fill";
type S = {
  brightness: number; contrast: number; gamma: number; saturation: number; warmth: number; tint: number;
  hue: number; bw: number; sepia: number; sharpness: number; soften: Soften; vignette: number; zoom: number;
  fit: Fit; mirror: boolean; flip: boolean; ambient: boolean;
};

const DEFAULTS: S = {
  brightness: 100, contrast: 100, gamma: 1, saturation: 100, warmth: 0, tint: 0, hue: 0, bw: 0, sepia: 0,
  sharpness: 0, soften: "Off", vignette: 0, zoom: 100, fit: "contain", mirror: false, flip: false, ambient: false,
};

const PRESETS: Record<string, Partial<S>> = {
  Standard: {},
  Vivid: { brightness: 104, contrast: 115, saturation: 140, sharpness: 30 },
  Cinema: { brightness: 95, contrast: 110, gamma: 1.1, saturation: 90, warmth: 15, vignette: 35 },
  "Bright Room": { brightness: 112, contrast: 106, gamma: 0.85 },
  "Dark Room": { brightness: 85, contrast: 95, gamma: 1.2, warmth: 10 },
  "Night Light": { brightness: 80, warmth: 60, saturation: 85, gamma: 1.1 },
  Warm: { warmth: 40, saturation: 105 },
  Cool: { warmth: -40, tint: -5 },
  Anime: { saturation: 150, contrast: 112, sharpness: 50, brightness: 105 },
  Noir: { bw: 100, contrast: 140, vignette: 50, gamma: 1.15 },
  Vintage: { sepia: 60, saturation: 80, contrast: 90, vignette: 40, soften: "Low", warmth: 20 },
};

const SOFT_PX: Record<Soften, number> = { Off: 0, Low: 0.6, Med: 1.4, High: 2.6 };

function Slider({ label, value, min, max, step = 1, fmt, onChange }: {
  label: string; value: number; min: number; max: number; step?: number; fmt: (v: number) => string; onChange: (v: number) => void;
}) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div className="py-2.5">
      <div className="mb-2 flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground tabular-nums">{fmt(value)}</span>
      </div>
      <input type="range" className="panel-range" min={min} max={max} step={step} value={value}
        style={{ ["--fill" as string]: `${fill}%` }} onChange={(e) => onChange(Number(e.target.value))} aria-label={label} />
    </div>
  );
}

function Toggle({ label, sub, on, onChange }: { label: string; sub?: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className="flex w-full items-center justify-between py-2.5 text-left" role="switch" aria-checked={on}>
      <span className="text-sm">{label}{sub && <span className="block text-xs text-muted-foreground">{sub}</span>}</span>
      <span className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-foreground" : "bg-muted"}`}>
        <span className={`absolute top-1 h-4 w-4 rounded-full transition-all ${on ? "left-6 bg-background" : "left-1 bg-foreground"}`} />
      </span>
    </button>
  );
}

function Segmented<T extends string>({ options, value, onChange }: { options: { v: T; l: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-full border border-border p-1">
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)}
          className={`flex-1 rounded-full px-2 py-1.5 text-xs transition-colors ${value === o.v ? "bg-foreground font-semibold text-background" : "text-muted-foreground hover:text-foreground"}`}>
          {o.l}
        </button>
      ))}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border px-2 pt-4 pb-2">
      <h3 className="mb-1 text-xs font-semibold tracking-widest text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

function Index() {
  const [s, setS] = useState<S>({ ...DEFAULTS, ...PRESETS["Bright Room"] });
  const [preset, setPreset] = useState<string>("Bright Room");
  const set = <K extends keyof S>(k: K, v: S[K]) => { setS((p) => ({ ...p, [k]: v })); setPreset("Custom"); };
  const pct = (v: number) => `${Math.round(v)}%`;
  const signed = (v: number) => (v > 0 ? `+${v}` : `${v}`);

  // Gamma approximated with a brightness/contrast curve (gamma < 1 lifts midtones)
  const gB = Math.pow(1 / s.gamma, 0.35);
  const gC = Math.pow(s.gamma, 0.15);
  const sharpC = 1 + s.sharpness / 100 * 0.15;
  const filter = [
    `brightness(${(s.brightness / 100 * gB).toFixed(3)})`,
    `contrast(${(s.contrast / 100 * gC * sharpC).toFixed(3)})`,
    `saturate(${s.saturation / 100})`,
    `hue-rotate(${s.hue}deg)`,
    `sepia(${s.sepia / 100})`,
    `grayscale(${s.bw / 100})`,
    SOFT_PX[s.soften] ? `blur(${SOFT_PX[s.soften]}px)` : "",
  ].join(" ");
  const z = s.zoom / 100;
  const transform = `scale(${z}) scaleX(${s.mirror ? -1 : 1}) scaleY(${s.flip ? -1 : 1})`;
  const warmTint = `oklch(0.7 0.2 ${s.warmth >= 0 ? 60 : 250} / ${Math.abs(s.warmth) / 100 * 0.25})`;
  const tintCol = `oklch(0.7 0.2 ${s.tint >= 0 ? 330 : 145} / ${Math.abs(s.tint) / 100 * 0.2})`;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 p-6 lg:grid-cols-[1fr_380px]">
        <div className="relative self-start lg:sticky lg:top-6">
          {s.ambient && (
            <img src={preview} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-3xl" style={{ filter }} />
          )}
          <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-background">
            <img src={preview} alt="Preview" width={1280} height={768} className="h-full w-full transition-[filter,transform] duration-300"
              style={{ filter, transform, objectFit: s.fit }} />
            <div className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: warmTint }} />
            <div className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: tintCol }} />
            <div className="pointer-events-none absolute inset-0"
              style={{ boxShadow: `inset 0 0 ${s.vignette * 2.4}px ${s.vignette * 1.2}px oklch(0 0 0 / ${s.vignette / 100})` }} />
          </div>
        </div>

        <aside className="rounded-2xl bg-background p-3">
          <header className="flex items-center justify-between px-2 py-3">
            <button className="flex items-center gap-2 text-base"><ArrowLeft className="h-5 w-5" /> Picture</button>
            <span className="text-sm text-muted-foreground">{preset}</span>
          </header>

          <div className="flex flex-wrap gap-2 px-2 pb-4">
            {Object.keys(PRESETS).map((p) => (
              <button key={p} onClick={() => { setS({ ...DEFAULTS, ...PRESETS[p] }); setPreset(p); }}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${preset === p
                  ? "border-foreground bg-foreground font-semibold text-background ring-2 ring-foreground ring-offset-2 ring-offset-background"
                  : "border-border hover:border-muted-foreground"}`}>
                {p}
              </button>
            ))}
          </div>

          <Section title="LIGHT">
            <Slider label="Brightness" value={s.brightness} min={0} max={200} fmt={pct} onChange={(v) => set("brightness", v)} />
            <Slider label="Contrast" value={s.contrast} min={0} max={200} fmt={pct} onChange={(v) => set("contrast", v)} />
            <Slider label="Gamma" value={s.gamma} min={0.1} max={3} step={0.05} fmt={(v) => v.toFixed(2)} onChange={(v) => set("gamma", v)} />
          </Section>
          <Section title="COLOR">
            <Slider label="Saturation" value={s.saturation} min={0} max={200} fmt={pct} onChange={(v) => set("saturation", v)} />
            <Slider label="Warmth" value={s.warmth} min={-100} max={100} fmt={signed} onChange={(v) => set("warmth", v)} />
            <Slider label="Tint" value={s.tint} min={-100} max={100} fmt={signed} onChange={(v) => set("tint", v)} />
            <Slider label="Hue" value={s.hue} min={-180} max={180} fmt={(v) => `${signed(v)}°`} onChange={(v) => set("hue", v)} />
            <Slider label="Black and White" value={s.bw} min={0} max={100} fmt={pct} onChange={(v) => set("bw", v)} />
            <Slider label="Sepia" value={s.sepia} min={0} max={100} fmt={pct} onChange={(v) => set("sepia", v)} />
          </Section>
          <Section title="DETAIL">
            <Slider label="Sharpness" value={s.sharpness} min={0} max={100} fmt={pct} onChange={(v) => set("sharpness", v)} />
            <div className="py-2.5">
              <div className="mb-2 text-sm">Soften</div>
              <Segmented options={(["Off", "Low", "Med", "High"] as Soften[]).map((v) => ({ v, l: v }))} value={s.soften} onChange={(v) => set("soften", v)} />
            </div>
            <Slider label="Vignette" value={s.vignette} min={0} max={100} fmt={pct} onChange={(v) => set("vignette", v)} />
          </Section>
          <Section title="FRAME">
            <Slider label="Zoom" value={s.zoom} min={50} max={300} fmt={pct} onChange={(v) => set("zoom", v)} />
            <div className="py-2.5">
              <div className="mb-2 text-sm">Fit Mode</div>
              <Segmented<Fit> options={[{ v: "contain", l: "Whole picture" }, { v: "cover", l: "Fill the screen" }, { v: "fill", l: "Stretch" }]}
                value={s.fit} onChange={(v) => set("fit", v)} />
            </div>
            <Toggle label="Mirror" sub="Left/Right swapped" on={s.mirror} onChange={(v) => set("mirror", v)} />
            <Toggle label="Upside Down" sub="180° rotate" on={s.flip} onChange={(v) => set("flip", v)} />
            <Toggle label="Ambient Mode" sub="Glow around the picture" on={s.ambient} onChange={(v) => set("ambient", v)} />
          </Section>

          <div className="border-t border-border px-2 pt-4 pb-2">
            <button onClick={() => { setS(DEFAULTS); setPreset("Standard"); }}
              className="w-full rounded-full border border-border py-2.5 text-sm font-semibold transition-colors hover:bg-foreground hover:text-background">
              Reset the Picture
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
