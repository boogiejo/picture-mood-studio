import { cx } from "./cx";
import { buildPictureEffects } from "./effects";
import "./picture-settings.css";
import type { PictureSettings } from "./types";

export type PicturePreviewProps = {
  /** Anything the browser can load as an image: a URL, or a bundled asset import. */
  src: string;
  alt?: string | undefined;
  settings: PictureSettings;
  /** Extra classes on the frame that clips the picture. */
  className?: string | undefined;
};

/**
 * The picture itself. Every setting is rendered with plain CSS: `filter` for
 * light, color and detail, `transform` for zoom and flips, `object-fit` for the
 * fit mode, and soft-light layers for warmth, tint and vignette.
 */
export function PicturePreview({ src, alt = "Picture preview", settings, className }: PicturePreviewProps) {
  const effects = buildPictureEffects(settings);

  return (
    <div className="relative self-start lg:sticky lg:top-6">
      {settings.ambient && (
        <img
          src={src}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-3xl"
          style={{ filter: effects.filter }}
        />
      )}
      <div
        className={cx(
          "relative aspect-video overflow-hidden rounded-xl border border-border bg-background",
          className,
        )}
      >
        <img
          src={src}
          alt={alt}
          className="h-full w-full transition-[filter,transform] duration-300"
          style={{
            filter: effects.filter,
            transform: effects.transform,
            objectFit: effects.objectFit,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{ background: effects.warmthOverlay }}
        />
        <div
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{ background: effects.tintOverlay }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: effects.vignette }}
        />
      </div>
    </div>
  );
}
