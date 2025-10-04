import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes"

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flowt",
  description:
    "Expense reports that just flow. Intelligent multi-level approvals, built for speed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <body className={`${plexSans.variable} antialiased`}>{children}</body>
      </ThemeProvider>
    </html>
  );
}
