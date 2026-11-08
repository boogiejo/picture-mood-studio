# Picture Mood Studio

Build an interactive "Picture Settings" control panel component styled with a clean, modern dark-mode aesthetic (matching the dark theme in the attached screenshots).

Key Features & UI Structure:

1. Top Navigation Bar:

   - Header with back arrow "← Picture" on the left and the active preset name (e.g., "Bright Room") on the right.

2. Preset Selector Chips (Scrollable/Wrap Grid):

   - Interactive preset buttons: [Standard], [Vivid], [Cinema], [Bright Room], [Dark Room], [Night Light], [Warm], [Cool], [Anime], [Noir], [Vintage].

   - Clicking a preset updates all slider values dynamically to pre-configured target values (e.g., "Bright Room" sets Brightness to 112%, Contrast to 106%, Gamma to 0.85).

3. Categorized Adjustment Sliders (Supports Values Below 0 and Above 100%):

   - Category: LIGHT

     • Brightness (Range: 0% to 200%, Default: 100%)

     • Contrast (Range: 0% to 200%, Default: 100%)

     • Gamma (Range: 0.1 to 3.0, Default: 1.0)

   - Category: COLOR

     • Saturation (Range: 0% to 200%, Default: 100%)

     • Warmth (Range: -100 to +100, Default: 0)

     • Tint (Range: -100 to +100, Default: 0)

     • Hue (Range: -180° to +180°, Default: 0°)

     • Black and White (Range: 0% to 100%, Default: 0%)

     • Sepia (Range: 0% to 100%, Default: 0%)

   - Category: DETAIL

     • Sharpness (Range: 0% to 100%, Default: 0%)

     • Soften (Toggle / Dropdown: Off, Low, Med, High)

     • Vignette (Range: 0% to 100%, Default: 0%)

   - Category: FRAME

     • Zoom (Range: 50% to 300%, Default: 100%)

     • Fit Mode (Segmented Button Choice: [Whole picture], [Fill the screen], [Stretch])

     • Toggle Switches: Mirror (Left/Right swapped), Upside Down (180° Rotate), Ambient Mode.

4. Reset Control:

   - Include a "Reset the Picture" button at the bottom that restores all sliders and toggles back to their default baseline values.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://picture-mood-studio.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/57c67686-08b3-49a6-9df6-8568a7fc381c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
