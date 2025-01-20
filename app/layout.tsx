import type { Metadata } from "next";
import "./globals.css";
import { Josefin_Sans } from "next/font/google";

const font = Josefin_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clif's Boggle",
  description: "Online board for the popular game, Boggle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
