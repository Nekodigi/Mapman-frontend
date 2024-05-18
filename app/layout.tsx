import { Inter as FontSans } from "next/font/google";

import type { Metadata, Viewport } from "next";

import "./globals.css";
import { AccountProvider } from "@/components/context/account";
import AuthProvider from "@/components/context/auth";
import { Footer } from "@/components/organisms/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/plate-ui/tooltip";
import { pdfjs } from "react-pdf";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const APP_NAME = "Mapman";
const APP_DEFAULT_TITLE = "Mapman";
const APP_TITLE_TEMPLATE = "%s - Mapman";
const APP_DESCRIPTION = "Fast, map / compass for travelers.";
export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background flex h-screen flex-col font-sans antialiased ",
          fontSans.variable
        )}
      >
        <AuthProvider>
          <AccountProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider
                disableHoverableContent
                delayDuration={500}
                skipDelayDuration={0}
              >
                {children}
                <Footer />
                <Toaster />
              </TooltipProvider>
            </ThemeProvider>
          </AccountProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
