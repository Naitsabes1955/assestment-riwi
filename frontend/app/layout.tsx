import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Riwi Messaging",
  description: "Frontend demo for Riwi Messaging",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
