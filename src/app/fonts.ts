import localFont from "next/font/local";
import { Plus_Jakarta_Sans } from "next/font/google";

export const atma = localFont({
  src: "./fonts/Atma-Bold.ttf",
  variable: "--font-atma",
  weight: "700",
  display: "swap",
});

export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});
