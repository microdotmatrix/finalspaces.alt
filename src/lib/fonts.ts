import {
  Bebas_Neue,
  JetBrains_Mono,
  Montserrat,
  Pathway_Extreme,
} from "next/font/google";

const body = Montserrat({
  subsets: ["latin"],
  variable: "--font-family-montserrat",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-family-jetbrains-mono",
});

const heading = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-family-bebas-neue",
});

const display = Pathway_Extreme({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-family-pathway",
});

export { body, display, heading, mono };
