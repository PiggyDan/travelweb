import { Fraunces, Manrope } from "next/font/google";

/** Brand fonts, shared by the public site and admin root layouts. */

export const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
  display: "swap",
});

export const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});
