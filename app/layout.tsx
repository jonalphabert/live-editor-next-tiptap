import type { Metadata } from "next";
import { Geist, Outfit } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Live Editor",
  description: "Experience seamless and intuitive content creation with our Live Editor, designed for modern web development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-gray-900 dark:text-white bg-white text-gray-900`}
      >
       <ThemeProvider>
          {/* Your layout structure */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
