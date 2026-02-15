import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QC Mechanical Management Plan",
  description: "Comprehensive QC Management System for Mechanical Engineering Projects. Track inspections, NCRs, and project documentation efficiently.",
  keywords: ["QC Mechanical Management", "Engineering", "Project Management", "Inspections", "NCR", "Construction"],
  authors: [{ name: "QC Mechanical Management Team" }],
  icons: {
    icon: "/ar-logo.svg",
    apple: "/ar-logo.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "QC Mechanical Management Plan",
    description: "Steamline your QC processes with our advanced management platform.",
    url: "https://qc-mechanical-management-plan.vercel.app",
    siteName: "QC Mechanical Management Plan",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QC Mechanical Management Plan",
    description: "Steamline your QC processes with our advanced management platform.",
  },
};

import { Providers } from "@/components/providers";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <ServiceWorkerRegister />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}

