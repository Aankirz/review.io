import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { FeedbackBanner } from "@/components/Layout/FeedbackBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Review.io",
  description: "Real Reviews from Real People",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <FeedbackBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
