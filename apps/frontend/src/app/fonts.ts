
import { Cairo } from "next/font/google";

export const cairo = Cairo({
  subsets: ["arabic"],
  style: ["normal"],
  display: 'swap',
  preload: true,
  adjustFontFallback: true
});