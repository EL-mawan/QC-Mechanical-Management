import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
  description: "Modern Next.js scaffold optimized for AI-powered development with Z.ai. Built with TypeScript, Tailwind CSS, and shadcn/ui.",
  keywords: ["QC Mechanical Management Plan", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "AI development", "React"],
  authors: [{ name: "QC Mechanical Management Plan" }],
  icons: {
    icon: "/ar-logo.svg",
  },
  openGraph: {
    title: "QC Mechanical Management Plan",
    description: "AI-powered development with modern React stack",
    url: "https://qc-mechanical-management-plan.vercel.app",
    siteName: "QC Mechanical Management Plan",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QC Mechanical Management Plan",
    description: "AI-powered development with modern React stack",
  },
};

import { Providers } from "@/components/providers";

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
        </Providers>
      </body>
    </html>
  );
}

