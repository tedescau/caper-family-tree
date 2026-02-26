import type { Metadata } from "next";
import {
  Playfair_Display,
  Spectral,
  Instrument_Serif,
  Inter,
} from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-spectral",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Momofuku Family Tree | Caper",
  description:
    "How one restaurant group shaped a generation of New York chefs. An interactive visualization of the Momofuku alumni network.",
  openGraph: {
    title: "The Momofuku Family Tree",
    description:
      "How one restaurant group shaped a generation of New York chefs.",
    images: ["/og.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${spectral.variable} ${instrumentSerif.variable} ${inter.variable}`}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className="bg-[#E2E6DF] text-[#030712] antialiased">
        {children}
      </body>
    </html>
  );
}
