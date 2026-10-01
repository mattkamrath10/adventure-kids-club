const navy = "#1B1464";
const white = "#FFFFFF";

function channel(hex: string, start: number) {
  const value = parseInt(hex.replace("#", "").slice(start, start + 2), 16) / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string) {
  return (
    0.2126 * channel(hex, 0) + 0.7152 * channel(hex, 2) + 0.0722 * channel(hex, 4)
  );
}

export function contrastRatio(background: string, foreground: string) {
  const lighter = Math.max(luminance(background), luminance(foreground));
  const darker = Math.min(luminance(background), luminance(foreground));
  return (lighter + 0.05) / (darker + 0.05);
}

/** Navy ink on every current crew color beats white. Huge type can use this. */
export function inkClass(background: string) {
  return contrastRatio(background, navy) >= contrastRatio(background, white)
    ? "text-navy"
    : "text-white";
}

/** Body copy needs 4.5:1. Pip's purple does not reach that with navy or white. */
export function navyBodyOn(background: string) {
  return contrastRatio(background, navy) >= 4.5;
}

export { navy, white };
