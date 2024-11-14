import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "How to BORG | Your Ultimate BORG Guide",
  description: "Learn the sacred art of creating the perfect Black Out Rage Gallon (BORG). Step-by-step guide, safety tips, and community-driven BORG dictionary.",
  keywords: ["BORG", "Black Out Rage Gallon", "drink recipe", "party drinks", "hydration", "safety tips"],
  authors: [{ name: "BORG Master" }],
  
  // OpenGraph metadata for social sharing
  openGraph: {
    title: "How to BORG | The Sacred Guide",
    description: "Master the art of the Black Out Rage Gallon with our cyberpunk guide. Safe ratios, pro tips, and community wisdom.",
    type: "website",
    url: "https://howtoborg.org",
    images: [
      {
        url: "/og-image.jpg", // You'll need to create this image
        width: 1200,
        height: 630,
        alt: "How to BORG - Cyberpunk Guide",
      },
    ],
    siteName: "How to BORG",
  },
  
  // Twitter card
  twitter: {
    card: "summary_large_image",
    title: "How to BORG | Cyberpunk BORG Guide",
    description: "The ultimate cyberpunk guide to creating the perfect BORG. Safety first, party second.",
    images: ["/twitter-image.jpg"], // You'll need to create this image
  },
  
  // Apple specific
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "How to BORG",
  },
  
  // Mobile specific
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  
  // Theme color for browser UI
  themeColor: "#0a0a0f",
  
  // Icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-precomposed.png",
    },
  },
  
  // Manifest for PWA
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags for iOS */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Additional meta tags for Android */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
