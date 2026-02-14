import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Preloader from "@/components/Preloader"; // or PreloaderFull for more elaborate version
import CampusLayout from "@/campus/layout";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Progress Preparatory School | Excellence in Education",
    template: "%s | Progress Preparatory School",
  },
  description: "Progress Preparatory School - A distinguished pre and primary school in Lusaka, Zambia offering quality education from Baby Class to Grade 7 with Cambridge and Local curricula.",
  keywords: [
    "Progress Preparatory School",
    "Zambian School",
    "Lusaka",
    "Zambia",
    "Private School",
    "Cambridge Curriculum",
    "Local Curriculum",
    "Primary Education",
    "Baby Class",
    "Grade 7",
  ],
  authors: [{ name: "Progress Preparatory School" }],
  creator: "Progress Preparatory School",
  publisher: "Progress Preparatory School",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://progresspreparatoryschool.com"),
  openGraph: {
    type: "website",
    locale: "en_ZM",
    url: "https://progresspreparatoryschool.com",
    siteName: "Progress Preparatory School",
    title: "Progress Preparatory School | Excellence in Education",
    description: "A distinguished pre and primary school in Lusaka offering quality education from Baby Class to Grade 7.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Progress Preparatory School - Excellence in Education",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Progress Preparatory School | Excellence in Education",
    description: "A distinguished pre and primary school in Lusaka offering quality education from Baby Class to Grade 7.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#003087" },
    { media: "(prefers-color-scheme: dark)", color: "#001f5b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <CampusLayout>
          <Preloader /> {/* Add this line */}
          {children}
        </CampusLayout>
        <Toaster />
      </body>
    </html>
  );
}