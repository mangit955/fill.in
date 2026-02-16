import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = "Fill.in";
const siteUrl = "https://fill-in-ten.vercel.app/";
const description =
  "Create powerful forms with logic jumps, conditional fields, and shareable links. Build forms like Tally for free with Fill.in.";

export const metadata: Metadata = {
  metadataBase: new URL("https://fill-in-ten.vercel.app/"),

  title: {
    default: "Fill.in — Free Online Form Builder",
    template: "%s | Fill.in",
  },

  description:
    "Create powerful forms with logic jumps, conditional fields, and shareable links. Build forms like Tally for free with Fill.in.",

  applicationName: "Fill.in",

  keywords: [
    "form builder",
    "tally forms",
    "online forms",
    "survey builder",
    "conditional forms",
    "logic jump forms",
  ],

  authors: [{ name: "Fill.in" }],
  creator: "Fill.in",

  openGraph: {
    title: "Fill.in — Free Online Form Builder",
    description:
      "Create powerful forms with logic jumps, conditional fields, and shareable links.",
    url: "https://fill-in-ten.vercel.app/",
    siteName: "Fill.in",
    images: [
      {
        url: "/og.png", // place inside /public
        width: 1200,
        height: 630,
        alt: "Fill.in Form Builder",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Fill.in — Free Online Form Builder",
    description:
      "Create powerful forms with logic jumps and conditional fields.",
    images: ["/og.png"],
  },

  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },

  alternates: {
    canonical: "https://fill-in-ten.vercel.app/",
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
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
