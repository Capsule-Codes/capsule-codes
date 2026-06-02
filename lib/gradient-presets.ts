/**
 * Curated, on-brand gradient presets for project home cards.
 *
 * The admin picks a preset KEY per project (stored in `projects.gradient_preset`);
 * the UI maps the key to concrete CSS here. Storing a key (not raw colors) keeps
 * every card on-brand and impossible to break.
 *
 * - `background`: card base fill (used for projects without a cover image, and
 *   as the canvas behind the blurred-backdrop for portrait covers).
 * - `overlay`: bottom-to-transparent fade behind the title, tinted with the
 *   preset hue while staying dark enough for white-text legibility.
 * - `swatch`: compact preview used by the admin preset picker.
 *
 * The `cyan` preset reproduces the previous hard-coded FALLBACK_BG, so projects
 * with no preset selected render exactly as before.
 */
export interface GradientPreset {
  key: string;
  label: string;
  background: string;
  overlay: string;
  swatch: string;
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    key: "cyan",
    label: "Cyan",
    background:
      "radial-gradient(ellipse at 30% 30%, oklch(0.4 0.18 180 / 0.5), transparent 60%), oklch(0.12 0.02 200)",
    overlay:
      "linear-gradient(180deg, transparent 45%, oklch(0.08 0.04 200 / 0.95))",
    swatch: "linear-gradient(135deg, oklch(0.5 0.18 180), oklch(0.18 0.05 200))",
  },
  {
    key: "emerald",
    label: "Emerald",
    background:
      "radial-gradient(ellipse at 30% 30%, oklch(0.42 0.16 155 / 0.5), transparent 60%), oklch(0.12 0.02 175)",
    overlay:
      "linear-gradient(180deg, transparent 45%, oklch(0.08 0.04 165 / 0.95))",
    swatch: "linear-gradient(135deg, oklch(0.5 0.16 155), oklch(0.18 0.05 175))",
  },
  {
    key: "violet",
    label: "Violet",
    background:
      "radial-gradient(ellipse at 30% 30%, oklch(0.45 0.18 290 / 0.5), transparent 60%), oklch(0.12 0.03 285)",
    overlay:
      "linear-gradient(180deg, transparent 45%, oklch(0.09 0.05 290 / 0.95))",
    swatch: "linear-gradient(135deg, oklch(0.52 0.18 290), oklch(0.18 0.06 285))",
  },
  {
    key: "amber",
    label: "Amber",
    background:
      "radial-gradient(ellipse at 30% 30%, oklch(0.55 0.15 70 / 0.5), transparent 60%), oklch(0.13 0.03 60)",
    overlay:
      "linear-gradient(180deg, transparent 45%, oklch(0.1 0.04 55 / 0.95))",
    swatch: "linear-gradient(135deg, oklch(0.62 0.15 70), oklch(0.18 0.05 55))",
  },
  {
    key: "rose",
    label: "Rose",
    background:
      "radial-gradient(ellipse at 30% 30%, oklch(0.5 0.18 18 / 0.5), transparent 60%), oklch(0.13 0.03 15)",
    overlay:
      "linear-gradient(180deg, transparent 45%, oklch(0.09 0.05 15 / 0.95))",
    swatch: "linear-gradient(135deg, oklch(0.56 0.18 18), oklch(0.18 0.06 15))",
  },
  {
    key: "slate",
    label: "Slate",
    background:
      "radial-gradient(ellipse at 30% 30%, oklch(0.4 0.04 240 / 0.5), transparent 60%), oklch(0.12 0.01 240)",
    overlay:
      "linear-gradient(180deg, transparent 45%, oklch(0.07 0.01 240 / 0.95))",
    swatch: "linear-gradient(135deg, oklch(0.45 0.04 240), oklch(0.16 0.02 240))",
  },
];

export const DEFAULT_GRADIENT_PRESET = GRADIENT_PRESETS[0];

/** Sentinel key for a project-defined two-color gradient. */
export const CUSTOM_GRADIENT_KEY = "custom";

/** Resolve a preset key to its definition, falling back to the default (cyan). */
export function getGradientPreset(key?: string | null): GradientPreset {
  if (!key) return DEFAULT_GRADIENT_PRESET;
  return (
    GRADIENT_PRESETS.find((preset) => preset.key === key) ??
    DEFAULT_GRADIENT_PRESET
  );
}

/**
 * Build a gradient from two custom colors (the app's primary brand colors).
 * The overlay stays a neutral dark fade so the white title stays legible
 * regardless of the chosen colors.
 */
export function buildCustomGradient(from: string, to: string): GradientPreset {
  return {
    key: CUSTOM_GRADIENT_KEY,
    label: "Custom",
    background: `linear-gradient(145deg, ${from}, ${to})`,
    overlay: "linear-gradient(180deg, transparent 45%, oklch(0.06 0 0 / 0.95))",
    swatch: `linear-gradient(135deg, ${from}, ${to})`,
  };
}

/**
 * Resolve the effective gradient for a project: a custom two-color gradient
 * when `preset === "custom"` and both colors are present, otherwise the
 * curated preset (falling back to the default cyan).
 */
export function resolveProjectGradient(
  preset?: string | null,
  from?: string | null,
  to?: string | null
): GradientPreset {
  if (preset === CUSTOM_GRADIENT_KEY && from && to) {
    return buildCustomGradient(from, to);
  }
  return getGradientPreset(preset);
}
