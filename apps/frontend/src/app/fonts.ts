
import { Noto_Sans_Arabic } from "next/font/google";

export const notoSans = Noto_Sans_Arabic({
  subsets: ["arabic"],
  style: ["normal"],
  display: 'swap',
  preload: true,
  adjustFontFallback: true
});