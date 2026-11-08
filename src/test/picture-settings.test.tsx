import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  buildFilter,
  DEFAULT_PICTURE_SETTINGS,
  PICTURE_PRESETS,
  PictureSettingsControl,
} from "@/components/picture-settings";

const IMAGE = "https://example.com/photo.jpg";

function renderPanel() {
  const utils = render(
    <PictureSettingsControl imageSrc={IMAGE} defaultValue={PICTURE_PRESETS["Bright Room"]} />,
  );
  const slider = (label: string) => screen.getByLabelText(label) as HTMLInputElement;
  const presetName = () =>
    utils.container.querySelector('[data-slot="picture-settings-preset-name"]')?.textContent;
  return { ...utils, slider, presetName };
}

describe("Picture settings", () => {
  it("opens on the Bright Room preset values", () => {
    const { slider, presetName } = renderPanel();

    expect(presetName()).toBe("Bright Room");
    expect(slider("Brightness").value).toBe("112");
    expect(slider("Contrast").value).toBe("106");
    expect(slider("Gamma").value).toBe("0.85");
  });

  it("applies every value of a preset when its chip is clicked", () => {
    const { slider, presetName } = renderPanel();

    fireEvent.click(screen.getByRole("button", { name: "Vivid" }));

    expect(presetName()).toBe("Vivid");
    expect(slider("Saturation").value).toBe("140");
    expect(slider("Contrast").value).toBe("115");
    expect(slider("Sharpness").value).toBe("30");
  });

  it("marks the picture Custom when a control is moved by hand", () => {
    const { slider, presetName } = renderPanel();

    fireEvent.change(slider("Brightness"), { target: { value: "120" } });

    expect(presetName()).toBe("Custom");
    expect(slider("Brightness").value).toBe("120");
  });

  it("restores every default when the picture is reset", () => {
    const { slider, presetName } = renderPanel();

    fireEvent.click(screen.getByRole("button", { name: "Vivid" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset the Picture" }));

    expect(presetName()).toBe("Standard");
    expect(slider("Brightness").value).toBe("100");
    expect(slider("Contrast").value).toBe("100");
    expect(slider("Saturation").value).toBe("100");
    expect(slider("Gamma").value).toBe("1");
    expect(slider("Zoom").value).toBe("100");
  });

  it("keeps the default picture free of color rotation", () => {
    expect(buildFilter(DEFAULT_PICTURE_SETTINGS)).toBe(
      "brightness(1.000) contrast(1.000) saturate(1) hue-rotate(0deg) sepia(0) grayscale(0)",
    );
  });

  it("lifts the midtones as gamma drops below 1", () => {
    const filter = buildFilter({ ...DEFAULT_PICTURE_SETTINGS, gamma: 0.5 });

    expect(filter).toContain("brightness(1.275)");
    expect(filter).toContain("contrast(0.901)");
  });
});
