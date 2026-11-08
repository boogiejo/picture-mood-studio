import { createFileRoute } from "@tanstack/react-router";

import preview from "@/assets/preview.jpg";
import { PICTURE_PRESETS, PictureSettingsControl } from "@/components/picture-settings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Picture Settings" },
      {
        name: "description",
        content: "Interactive picture settings panel with presets, color, detail and frame controls.",
      },
      { property: "og:title", content: "Picture Settings" },
      {
        property: "og:description",
        content: "Tune brightness, color, detail and framing with live preview.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PictureSettingsControl
        imageSrc={preview}
        defaultValue={PICTURE_PRESETS["Bright Room"]}
        onBack={() => history.back()}
      />
    </main>
  );
}
