import type { Metadata } from "next";
import { Intel_One_Mono, Inter } from "next/font/google";
import "./globals.css";

const mono = Intel_One_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

// Only used for the "rmp." logo (Inter Black)
const inter = Inter({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-logo",
});

export const metadata: Metadata = {
  title: "wow. | Rate My Professor, by students",
  description: "Wondering what your professor is really like?",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${mono.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
