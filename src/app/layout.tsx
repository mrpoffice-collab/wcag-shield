import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WCAG Shield - Accessibility Compliance Protection",
  description: "Protect your website from ADA lawsuits with WCAG compliance scanning, documented audit trails, and court-ready reports.",
  keywords: "WCAG, accessibility, ADA compliance, web accessibility, audit trail, legal protection",
  openGraph: {
    title: "WCAG Shield - Accessibility Compliance Protection",
    description: "Protect your website from ADA lawsuits with documented compliance history.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
